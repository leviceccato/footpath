import { type ButtonProps } from '@/components/Button'
import { Popover } from '@/components/Popover'
import { type IconName, useIcons } from '@/providers/Icons'
import { Text } from '@/components/Text'
import { VisuallyHidden } from '@/components/VisuallyHidden'
import { sleep } from '@/utils/misc'
import { type Instance, type VirtualElement } from '@popperjs/core'
import { type Component, createSignal } from 'solid-js'
import { splitProps } from 'solid-js'
import * as css from './IconButton.css'

const tooltipOffsetX = 0
const tooltipOffsetY = 0

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

	const virtualReference: {
		getBoundingClientRect: VirtualElement['getBoundingClientRect'] | null
	} = {
		getBoundingClientRect: null,
	}

	function updateVirtualReference(event: MouseEvent): void {
		const _x = event.clientX + tooltipOffsetX
		const _y = event.clientY + tooltipOffsetY

		// Satisfy DOMRect

		virtualReference.getBoundingClientRect = () => ({
			x: _x,
			y: _y,
			width: 0,
			height: 0,
			top: _y,
			right: _x,
			bottom: _y,
			left: _x,
			toJSON: () => {},
		})

		popover()?.update()
	}

	async function clearVirtualReference() {
		// Delay before resetting to avoid any visual glitches
		await sleep(150)

		virtualReference.getBoundingClientRect = null

		popover()?.update()
	}

	return (
		<Popover
			{...buttonProps}
			class={`${buttonProps.class || ''} ${css.button}`}
			tooltipClass={css.tooltip}
			when="hover"
			mount="tooltip"
			options={{
				placement: 'top-start',
				modifiers: [{ name: 'offset', options: { offset: [14, 14] } }],
			}}
			onUpdateInstance={setPopover}
			virtualReference={virtualReference}
			onMouseMove={updateVirtualReference}
			onMouseLeave={clearVirtualReference}
			reference={() => (
				<>
					<VisuallyHidden>{_props.tooltip}</VisuallyHidden>
					<Icon
						class={`${css.icon} ${_props.iconClass ?? ''}`}
						name={_props.name}
					/>
				</>
			)}
		>
			<div
				aria-hidden
				class={css.tooltipInner}
			>
				<Text variant="bodyXxs">{_props.tooltip}</Text>
			</div>
		</Popover>
	)
}
