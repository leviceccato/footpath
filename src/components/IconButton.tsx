import { Component, createSignal } from 'solid-js'
import { splitProps } from 'solid-js'
import { useIcons } from '@/components/ProviderIcons'
import type { IconName } from '@/components/ProviderIcons'
import * as css from './IconButton.css'
import type { VirtualElement, Instance } from '@popperjs/core'

import type { ButtonProps } from '@/components/Button'
import Popover from '@/components/Popover'
import Text from '@/components/Text'
import VisuallyHidden from '@/components/VisuallyHidden'

const tooltipOffsetX = 0
const tooltipOffsetY = 0

const IconButton: Component<
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

	let virtualReference: VirtualElement = {
		getBoundingClientRect: createGetBoundingClientRect(0, 0),
	}

	function createGetBoundingClientRect(
		x: number,
		y: number,
	): VirtualElement['getBoundingClientRect'] {
		const _x = x + tooltipOffsetX
		const _y = y + tooltipOffsetY

		// Satisfy DOMRect

		return () => ({
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
	}

	function updateVirtualReference(event: MouseEvent): void {
		virtualReference.getBoundingClientRect = createGetBoundingClientRect(
			event.clientX,
			event.clientY,
		)
		popover()?.update()
	}

	return (
		<Popover
			{...buttonProps}
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

export default IconButton
