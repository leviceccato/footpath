import { Button, type ButtonProps } from '@/components/Button'
import { Popover, type PopoverState } from '@/components/Popover'
import { Text } from '@/components/Text'
import { VisuallyHidden } from '@/components/VisuallyHidden'
import { type IconName, useIcons } from '@/providers/Icons'
import { sleep } from '@/utils/misc'
import { type Instance, type VirtualElement } from '@popperjs/core'
import { type Component, createSignal } from 'solid-js'
import { splitProps } from 'solid-js'
import * as css from './IconButton.css'

const tooltipOffsetX = 0
const tooltipOffsetY = 0

const stubGetBoundingClientRect = () => new DOMRect()

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

	const [popover, setPopover] = createSignal<Instance>()
	const [state, setState] = createSignal<PopoverState>()

	const virtualElement: VirtualElement = {
		getBoundingClientRect: stubGetBoundingClientRect,
	}

	function updateVirtualReference(event: MouseEvent): void {
		const x = event.clientX + tooltipOffsetX
		const y = event.clientY + tooltipOffsetY

		/* Satisfy DOMRect */
		virtualElement.getBoundingClientRect = () => ({
			x,
			y,
			width: 0,
			height: 0,
			top: y,
			right: x,
			bottom: y,
			left: x,
			toJSON: () => {},
		})

		popover()?.update()
	}

	async function clearVirtualReference() {
		/* Delay before resetting to avoid any visual glitches */
		await sleep(150)

		virtualElement.getBoundingClientRect = stubGetBoundingClientRect

		popover()?.update()
	}

	return (
		<>
			<Button
				{...buttonProps}
				onMouseMove={updateVirtualReference}
				onMouseLeave={clearVirtualReference}
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
				onUpdateInstance={setPopover}
				element={virtualElement}
				options={{
					placement: 'top-start',
					modifiers: [{ name: 'offset', options: { offset: [14, 14] } }],
				}}
			>
				<div aria-hidden class={css.tooltipInner}>
					<Text variant="bodyXxs">{_props.tooltip}</Text>
				</div>
			</Popover>
		</>
	)
}
