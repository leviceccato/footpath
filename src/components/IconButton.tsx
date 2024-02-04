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
	class?: ButtonProps['class']
	onClick?: ButtonProps['onClick']
	refSignal?: ButtonProps['refSignal']
}> = (props) => {
	const [Icon] = useIcons()

	const [state, setState] = createSignal<PopoverState>()
	const [virtualElement, setVirtualElement] = createSignal<VirtualElement>()
	const refSignal = createSignal<HTMLButtonElement>()

	const refSignalOrProp = () => {
		return props.refSignal ?? refSignal
	}

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
				refSignal={refSignalOrProp()}
				onMouseMove={updateVirtualElement}
				onMouseLeave={clearVirtualElement}
				onClick={props.onClick}
				class={`${props.class ?? ''} ${css.button}`}
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
				elementRef={refSignalOrProp()}
				virtualElement={virtualElement}
			>
				<div aria-hidden class={css.tooltipInner}>
					<Text variant="bodyXxs">{props.tooltip}</Text>
				</div>
			</Popover>
		</>
	)
}
