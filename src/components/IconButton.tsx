import { Button, type ButtonProps } from '@/components/Button'
import { Popover, type PopoverState } from '@/components/Popover'
import { Text } from '@/components/Text'
import { VisuallyHidden } from '@/components/VisuallyHidden'
import { type IconName, useIcons } from '@/providers/Icons'
import { sleep } from '@/utils/misc'
import { type VirtualElement } from '@floating-ui/dom'
import { type Component, createSignal } from 'solid-js'
import { splitProps } from 'solid-js'
import * as css from './IconButton.css'

export const IconButton: Component<
	ButtonProps & {
		name: IconName
		tooltip: string
		iconClass?: string
	}
> = (props) => {
	const [Icon] = useIcons()

	const [_props, buttonProps] = splitProps(props, [
		'name',
		'tooltip',
		'iconClass',
	])

	let buttonRef: HTMLButtonElement | undefined
	const [state, setState] = createSignal<PopoverState>()
	const [mouseX, setMouseX] = createSignal(0)
	const [mouseY, setMouseY] = createSignal(0)

	let virtualElement: VirtualElement | undefined = {
		getBoundingClientRect: () => {
			const x = mouseX()
			const y = mouseY()

			return {
				x,
				y,
				top: y,
				left: x,
				bottom: y,
				right: x,
				width: 0,
				height: 0,
				/* Required to satisfy type */
				toJSON: () => {},
			}
		},
	}

	function updateMousePosition(event: MouseEvent): void {
		setMouseX(event.clientX)
		setMouseY(event.clientY)
	}

	async function clearVirtualElement() {
		/* Delay before resetting to avoid any visual glitches */
		await sleep(150)

		virtualElement = undefined
	}

	return (
		<>
			<Button
				ref={buttonRef}
				{...buttonProps}
				onMouseMove={updateMousePosition}
				onMouseLeave={clearVirtualElement}
				class={`${buttonProps.class || ''} ${css.button}`}
			>
				<VisuallyHidden>{_props.tooltip}</VisuallyHidden>
				<Icon
					class={`${css.icon} ${_props.iconClass ?? ''}`}
					name={_props.name}
				/>
			</Button>
			<Popover
				when="hover"
				mount="tooltip"
				state={[state, setState]}
				element={buttonRef}
				virtualElement={virtualElement}
			>
				<div aria-hidden class={css.tooltipInner}>
					<Text variant="bodyXxs">{_props.tooltip}</Text>
				</div>
			</Popover>
		</>
	)
}
