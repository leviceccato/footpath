import { Component, createSignal } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import { useIcons } from '@/components/ProviderIcons'
import type { IconName } from '@/components/ProviderIcons'
import * as css from './IconButton.css'
import type { VirtualElement, Instance } from '@popperjs/core'

import Button from '@/components/Button'
import type { ButtonProps } from '@/components/Button'
import Popover from '@/components/Popover'
import Text from '@/components/Text'
import VisuallyHidden from '@/components/VisuallyHidden'

const tooltipOffsetX = 0
const tooltipOffsetY = 0

const IconButton: Component<
	ButtonProps & {
		class?: string
		name: IconName
		tooltip: string
		iconClass?: string
	}
> = (props) => {
	const [Icon] = useIcons()

	const [_props, buttonProps] = splitProps(props, [
		'class',
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
			class={_props.class}
			tooltipClass={css.tooltip}
			when="hover"
			options={{
				placement: 'top-start',
				modifiers: [{ name: 'offset', options: { offset: [14, 14] } }],
			}}
			onUpdateInstance={setPopover}
			virtualReference={virtualReference}
			reference={({ isShown }) => (
				<Button
					{...buttonProps}
					onMouseMove={updateVirtualReference}
				>
					<Show when={!isShown()}>
						<VisuallyHidden>{_props.tooltip}</VisuallyHidden>
					</Show>
					<Icon
						class={`${css.icon} ${_props.iconClass ?? ''}`}
						name={_props.name}
					/>
				</Button>
			)}
		>
			<div class={css.tooltipInner}>
				<Text variant="bodyXxs">{_props.tooltip}</Text>
			</div>
		</Popover>
	)
}

export default IconButton
