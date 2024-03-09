import { Button, type ButtonProps } from '@/components/Button'
import { Popover, type PopoverProps } from '@/components/Popover'
import { Text } from '@/components/Text'
import { type IconProps, useIcons } from '@/providers/Icons'
import { defaultProps } from '@/utils/solid'
import type { Component, ParentComponent } from 'solid-js'
import * as css from './Menu.css'

export const Menu: ParentComponent<{
	elementRef: PopoverProps['elementRef']
	state: PopoverProps['state']
}> = (props) => {
	return (
		<Popover
			state={props.state}
			elementRef={props.elementRef}
			hasArrow={true}
			when="click"
			placement="bottom-start"
			offset={7}
		>
			<div class={css.root}>{props.children}</div>
		</Popover>
	)
}

export const MenuDivider: Component = () => {
	return <div class={css.divider} />
}

export const MenuButton: ParentComponent<{
	startIconName?: IconProps['name']
	endIconName?: IconProps['name']
	onClick?: ButtonProps['onClick']
	refSignal?: ButtonProps['refSignal']
}> = (rawProps) => {
	const props = defaultProps(rawProps, {
		startIconName: 'empty',
		endIconName: 'empty',
	})

	const [Icon] = useIcons()

	return (
		<Button
			class={css.button}
			onClick={props.onClick}
			refSignal={props.refSignal}
		>
			<Icon class={css.buttonIconVariant.default} name={props.startIconName} />
			<Text class={css.buttonText} variant="bodyXs">
				{props.children}
			</Text>
			<Icon class={css.buttonIconVariant.right} name={props.endIconName} />
		</Button>
	)
}

export const MenuChild: ParentComponent<{
	elementRef: PopoverProps['elementRef']
	state: PopoverProps['state']
}> = (props) => {
	return (
		<Popover
			state={props.state}
			elementRef={props.elementRef}
			when="hover-reference"
			placement="right-start"
			hoverShowDelay={0}
			hoverHideDelay={400}
			offset={{
				mainAxis: 4,
				crossAxis: -8,
			}}
		>
			<div class={css.root}>{props.children}</div>
		</Popover>
	)
}
