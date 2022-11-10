import { createSignal } from 'solid-js'
import { useI18n } from '@/components/I18n'
import type { Component } from 'solid-js'
import * as css from './TheApp.css'

import Button from '@/components/Button'
import LogoLacy from '@/components/LogoLacy'
import VisuallyHidden from '@/components/VisuallyHidden'
import TheMenu from '@/components/TheMenu'

const TheApp: Component = () => {
	const [t] = useI18n()

	return (
		<div class={css.root}>
			<header class={css.header}>
				<div class={css.logoContainer}>
					<Button
						class={css.logoLink}
						href="/"
					>
						<VisuallyHidden>{t().lacy}</VisuallyHidden>
						<LogoLacy class={css.logo} />
					</Button>
				</div>
				<div class={css.tabContainer}></div>
				<TheMenu class={css.menuContainer} />
			</header>
		</div>
	)
}

export default TheApp
