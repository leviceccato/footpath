import { For, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useI18n } from '@/components/ProviderI18n'
import { useTheme } from '@/components/ProviderTheme'
import { useIcons } from '@/components/ProviderIcons'
import type { Component } from 'solid-js'
import * as css from './TheApp.css'

import Button from '@/components/Button'
import Text from '@/components/Text'
import LogoLacy from '@/components/LogoLacy'
import VisuallyHidden from '@/components/VisuallyHidden'
import ScrollArea from '@/components/ScrollArea'
import TheMenu from '@/components/TheMenu'

type Tab = {
	id: number
	name: string
	isActive: boolean
	deletedAt: Date | null
}

const TheApp: Component = () => {
	const [theme, setColour] = useTheme()
	const [Icon] = useIcons()
	const [t] = useI18n()

	let tabId = 0

	const [tabs, setTabs] = createStore<Tab[]>([])
	addTab()

	function createTab(): Tab {
		return { id: ++tabId, name: t().untitled, isActive: false, deletedAt: null }
	}

	function addTab() {
		const tab = createTab()
		setTabs([...tabs, tab])
		activateTab(tab.id)
	}

	function activateTab(id: number) {
		setTabs(
			(tab) => tab.id === id || tab.isActive,
			(tab) => {
				if (tab.id === id && tab.isActive) {
					return tab
				}
				return { ...tab, isActive: !tab.isActive }
			},
		)
	}

	function deleteTab(id: number) {
		setTabs(
			(tab) => tab.id === id,
			'deletedAt',
			(deletedAt) => new Date(),
		)
	}

	return (
		<div
			class={`${css.root} ${theme().class}`}
			style={theme().vars}
		>
			<header class={css.header}>
				<div class={css.logoContainer}>
					<Button
						class={css.logoLink}
						href="/"
					>
						<VisuallyHidden>{t().lacy}</VisuallyHidden>
						<Icon
							class={css.logo}
							name="logoLacy"
						/>
					</Button>
				</div>
				<ScrollArea class={css.scrollArea}>
					<div class={css.tabContainer}>
						<For each={tabs}>
							{(tab) => (
								<Show when={!tab.deletedAt}>
									<div class={css.tabButtonWrapper}>
										<Button
											onClick={[activateTab, tab.id]}
											class={
												css.tabButtonVariant[
													tab.isActive ? 'active' : 'inactive'
												]
											}
										>
											<Text variant="bodyXs">{tab.name}</Text>
										</Button>
										<Button
											onClick={[deleteTab, tab.id]}
											class={
												css.closeTabButtonVariant[
													tab.isActive ? 'active' : 'inactive'
												]
											}
										>
											<Icon
												class={css.closeTabIcon}
												name="close"
											/>
										</Button>
									</div>
								</Show>
							)}
						</For>
					</div>
				</ScrollArea>
				<Button
					onClick={addTab}
					class={css.addTabButton}
				>
					<Icon
						class={css.addTabIcon}
						name="add"
					/>
				</Button>
				<TheMenu class={css.menuContainer} />
			</header>
			<main class={css.main}></main>
		</div>
	)
}

export default TheApp
