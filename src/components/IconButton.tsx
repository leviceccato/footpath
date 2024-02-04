import { Button, type ButtonProps } from '@/components/Button'
import { Popover, type PopoverState } from '@/components/Popover'
import { Text } from '@/components/Text'
import { VisuallyHidden } from '@/components/VisuallyHidden'
import { type IconName, useIcons } from '@/providers/Icons'
import { sleep } from '@/utils/misc'
import { type VirtualElement } from '@floating-ui/dom'
import { type Component, createSignal } from 'solid-js'
import * as css from './IconButton.css'

const CURSOR_SIZE = 16

export const IconButton: Component<{
	name: IconName
	tooltip: string
	iconClass?: string
	button?: ButtonProps
}> = (props) => {
	const [Icon] = useIcons()

	let buttonRef: HTMLButtonElement | undefined
	const [state, setState] = createSignal<PopoverState>()
	const [virtualElement, setVirtualElement] = createSignal<VirtualElement>()

	function updateVirtualElement(event: MouseEvent): void {
		setVirtualElement({
			getBoundingClientRect: () => {
				const x = event.clientX
				const y = event.clientY

				return {
					x,
					y,
					top: y,
					left: x,
					bottom: y + CURSOR_SIZE,
					right: x + CURSOR_SIZE,
					width: CURSOR_SIZE,
					height: CURSOR_SIZE,
					/* Required to satisfy type */
					toJSON: () => {},
				}
			},
		})
	}

	async function clearVirtualElement() {
		/* Delay before resetting to avoid any visual glitches */
		await sleep(150)

		setVirtualElement(undefined)
	}

	return (
		<>
			<Button
				ref={buttonRef}
				{...props.button}
				nativeButton={{
					onMouseMove: updateVirtualElement,
					onMouseLeave: clearVirtualElement,
					class: `${props.button?.nativeButton?.class ?? ''} ${css.button}`,
				}}
			>
				<VisuallyHidden>{props.tooltip}</VisuallyHidden>
				<Icon
					class={`${css.icon} ${props.iconClass ?? ''}`}
					name={props.name}
				/>
			</Button>
			<Popover
				class={css.tooltip}
				when="hover"
				mount="tooltip"
				offset={10}
				state={[state, setState]}
				element={buttonRef}
				virtualElement={virtualElement}
			>
				<div aria-hidden class={css.tooltipInner}>
					<Text variant="bodyXxs">{props.tooltip}</Text>
				</div>
			</Popover>
		</>
	)
}
