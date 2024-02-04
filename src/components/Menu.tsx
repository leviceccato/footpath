import { Popover, type PopoverProps } from '@/components/Popover'
import { type Component, type JSX } from 'solid-js'
import * as css from './Menu.css'

type Controller = {
	isShown: boolean
}

export const Menu: Component<{
	elementRef: PopoverProps['elementRef']
	state: PopoverProps['state']
	children: (_: Controller) => JSX.Element
}> = (props) => {
	const controller: Controller = {
		isShown: false,
	}

	return (
		<Popover
			state={props.state}
			elementRef={props.elementRef}
			hasArrow={true}
			when="click"
			placement="bottom-start"
			offset={8}
		>
			<div class={css.root}>{props.children(controller)}</div>
		</Popover>
	)
}
