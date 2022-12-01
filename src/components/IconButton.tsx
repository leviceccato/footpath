import { Component, createSignal, onCleanup } from 'solid-js'
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
		return () => ({
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
	}

	function updateVirtualReference(event: MouseEvent): void {
		virtualReference.getBoundingClientRect = createGetBoundingClientRect(
			event.clientX,
			event.clientY,
		)
		popover()?.update()
	}

	function addMousemoveListener(): void {
		document.addEventListener('mousemove', updateVirtualReference)
	}

	function removeMousemoveListener(): void {
		document.removeEventListener('mousemove', updateVirtualReference)
	}

	onCleanup(() => {
		removeMousemoveListener()
	})

	return (
		<Popover
			class={_props.class}
			when="hover"
			options={{
				placement: 'bottom-end',
				modifiers: [{ name: 'offset', options: { offset: [0, 9] } }],
			}}
			onShown={addMousemoveListener}
			onHidden={removeMousemoveListener}
			onUpdateInstance={setPopover}
			virtualReference={virtualReference}
			reference={({ isShown }) => (
				<Button {...buttonProps}>
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
			<div class={css.tooltip}>
				<Text variant="bodyXs">{_props.tooltip}</Text>
			</div>
		</Popover>
	)
}

export default IconButton
