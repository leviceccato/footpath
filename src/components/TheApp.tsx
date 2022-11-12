import { createSignal } from 'solid-js'
import { useI18n } from '@/components/ProviderI18n'
import { useTheme } from '@/components/ProviderTheme'
import type { Component } from 'solid-js'
import * as css from './TheApp.css'

import Button from '@/components/Button'
import LogoLacy from '@/components/LogoLacy'
import VisuallyHidden from '@/components/VisuallyHidden'
import ScrollArea from '@/components/ScrollArea'
import TheMenu from '@/components/TheMenu'

const TheApp: Component = () => {
	const [theme, setColour] = useTheme()
	const [t] = useI18n()

	return (
		<div
			classList={{ [css.root]: true, [theme().class]: true }}
			style={theme().vars}
		>
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
				<ScrollArea class={css.scrollArea}>
					<div class={css.tabContainer}>
						<Button class={css.tabButton}>Untitled</Button>
						<Button class={css.tabButton}>Untitled</Button>
						<Button class={css.tabButton}>Untitled</Button>
						<Button class={css.tabButton}>Untitled</Button>
					</div>
				</ScrollArea>
				<Button class={css.addTabButton}>+</Button>
				<TheMenu class={css.menuContainer} />
			</header>
			<main class={css.main} />
		</div>
	)
}

export default TheApp
