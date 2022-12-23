import { For, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useI18n } from '@/components/ProviderI18n'
import { useIcons } from '@/components/ProviderIcons'
import type { Component } from 'solid-js'
import * as css from './RouteMain.css'

import Button from '@/components/Button'
import Text from '@/components/Text'
import VisuallyHidden from '@/components/VisuallyHidden'
import ScrollArea from '@/components/ScrollArea'
import TheMenu from '@/components/TheMenu'
import IconButton from '@/components/IconButton'

type Tab = {
	id: number
	name: string
	isActive: boolean
	deletedAt: Date | null
}

const RouteMain: Component = () => {
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
			(_) => new Date(),
		)
	}

	return (
		<div class={css.root}>
			<header class={css.header}>
				<div class={css.logoContainer}>
					<Button
						class={css.logoLink}
						href="/"
					>
						<VisuallyHidden>Lacey</VisuallyHidden>
						<Icon
							class={css.logo}
							name="logoMain"
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
										<IconButton
											name="close"
											tooltip={t().close}
											onClick={() => deleteTab(tab.id)}
											class={
												css.closeTabVariant[
													tab.isActive ? 'active' : 'inactive'
												]
											}
										/>
									</div>
								</Show>
							)}
						</For>
					</div>
				</ScrollArea>
				<IconButton
					name="add"
					tooltip={t().document.new}
					onClick={addTab}
					class={css.addTabButton}
				/>
				<TheMenu class={css.menuContainer} />
			</header>
			<main class={css.main}>
				<div class={css.viewBar}>
					<div class={css.viewBarSection}></div>
					<div class={css.viewBarSection}></div>
				</div>
				<div class={css.viewContainer}>
					<div class={css.view}></div>
					<div class={css.view}>
						<iframe
							title={t().preview}
							class={css.viewSvg}
							src="/svg"
						></iframe>
					</div>
				</div>
			</main>
		</div>
	)
}

export default RouteMain
