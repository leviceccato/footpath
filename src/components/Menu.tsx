import { Button, type ButtonProps } from '@/components/Button'
import { Popover, type PopoverProps } from '@/components/Popover'
import { Text } from '@/components/Text'
import { type IconProps, useIcons } from '@/providers/Icons'
import { defaultProps } from '@/utils/solid'
import { type Component, type JSX, type ParentComponent } from 'solid-js'
import * as css from './Menu.css'

type Controller = {
	isShown: boolean
}

export const Menu: Component<{
	elementRef: PopoverProps['elementRef']
	state: PopoverProps['state']
	children: (_: Controller) => JSX.Element
}> & {
	Divider: Component
	Button: ParentComponent<{
		startIconName?: IconProps['name']
		endIconName?: IconProps['name']
		onClick?: ButtonProps['onClick']
	}>
} = (props) => {
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
			offset={7}
		>
			<div class={css.root}>{props.children(controller)}</div>
		</Popover>
	)
}

Menu.Divider = () => {
	return <div class={css.divider} />
}

Menu.Button = (rawProps) => {
	const props = defaultProps(rawProps, {
		startIconName: 'empty',
		endIconName: 'empty',
	})

	const [Icon] = useIcons()

	return (
		<Button class={css.button} onClick={props.onClick}>
			<Icon class={css.buttonIconVariant.default} name={props.startIconName} />
			<Text class={css.buttonText} variant="bodyXs">
				{props.children}
			</Text>
			<Icon class={css.buttonIconVariant.right} name={props.endIconName} />
		</Button>
	)
}
