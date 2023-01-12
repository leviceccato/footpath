import { For, Show, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useI18n } from '@/components/ProviderI18n'
import { useIcons } from '@/components/ProviderIcons'
import { usePortal } from '@/components/ProviderPortal'
import { useTheme } from '@/components/ProviderTheme'
import { decimalToPercentage, clamp } from '@/scripts/utils'
import type { Component } from 'solid-js'
import * as css from './RouteMain.css'

import Button from '@/components/Button'
import Text from '@/components/Text'
import VisuallyHidden from '@/components/VisuallyHidden'
import ScrollArea from '@/components/ScrollArea'
import TheMenu from '@/components/TheMenu'
import IconButton from '@/components/IconButton'
import CodeEditor from '@/components/CodeEditor'

type Tab = {
	id: number
	name: string
	isActive: boolean
	deletedAt: Date | null
}

const RouteMain: Component = () => {
	const [Icon, Symbols] = useIcons()
	const [t] = useI18n()
	const { Mounts } = usePortal()
	const [theme] = useTheme()

	let tabId = 0
	let mainRef: HTMLDivElement | undefined
	let mainDOMRect: DOMRect | undefined

	const [tabs, setTabs] = createStore<Tab[]>([])
	addTab()

	const [width, setWidth] = createSignal(0.5)

	const widthPercentage = () => decimalToPercentage(width())

	const oppositeWidth = () => 1 - width()

	const oppositeWidthPercentage = () => decimalToPercentage(oppositeWidth())

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

	function _setWidth(newWidth: number): void {
		setWidth(clamp(0, newWidth, 1))
	}

	function handleResizerDrag(event: MouseEvent): void {
		if (!mainDOMRect) return

		const x = (event.x - mainDOMRect.left) / mainDOMRect.width

		_setWidth(x)
	}

	function removeDragHandler(): void {
		window.removeEventListener('mousemove', handleResizerDrag)
	}

	function addDragHandler(): void {
		mainDOMRect = mainRef?.getBoundingClientRect()

		window.addEventListener('mousemove', handleResizerDrag)
	}

	function resetResizer(): void {
		setWidth(0.5)
	}

	return (
		<div
			class={`${theme().class} ${css.root}`}
			style={theme().vars}
		>
			<Symbols />
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
			<main
				ref={mainRef}
				class={css.main}
			>
				<div
					class={css.viewContainer}
					style={{ width: `calc(${widthPercentage()} - 0.5px` }}
				>
					<ScrollArea class={css.viewBar}>
						<div class={css.viewBarInner}>
							<Button
								class={css.viewBarButtonVariant.active}
								text={t().code}
							/>
							<Button
								class={css.viewBarButtonVariant.inactive}
								text={t().optimize}
							/>
						</div>
					</ScrollArea>
					<ScrollArea class={css.view}>
						<CodeEditor class={css.codeEditor} />
					</ScrollArea>
				</div>
				<div
					class={css.viewResizer}
					onMouseDown={addDragHandler}
					onMouseUp={removeDragHandler}
					onDblClick={resetResizer}
				/>
				<div
					class={css.viewContainer}
					style={{ width: `calc(${oppositeWidthPercentage()} - 0.5px` }}
				>
					<ScrollArea class={css.viewBar}>
						<div class={css.viewBarInner}>
							<Button
								class={css.viewBarButtonVariant.active}
								text={t().svg}
							/>
							<Button
								class={css.viewBarButtonVariant.inactive}
								text={t().symbols}
							/>
							<Button
								class={css.viewBarButtonVariant.inactive}
								text={t().data}
							/>
						</div>
					</ScrollArea>
					<div class={css.view}>
						<div class={css.viewSvg}>
							<iframe
								title={t().preview}
								class={css.viewSvgInner}
								src="/svg"
							/>
						</div>
					</div>
				</div>
			</main>
			<Mounts />
		</div>
	)
}

export default RouteMain
