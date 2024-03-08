import { Button } from '@/components/Button'
import { IconButton } from '@/components/IconButton'
import { Menu, MenuButton, MenuChild, MenuDivider } from '@/components/Menu'
import type { PopoverState } from '@/components/Popover'
import { ScrollArea } from '@/components/ScrollArea'
import { Text } from '@/components/Text'
import { useCodeDocuments } from '@/providers/CodeDocuments'
import { useI18n } from '@/providers/I18n'
import { type Component, For, createSignal } from 'solid-js'
import * as css from './Header.css'

export const Header: Component = () => {
	const [t] = useI18n()
	const codeDocuments = useCodeDocuments()

	const menuRefSignal = createSignal<HTMLButtonElement>()
	const menuStateSignal = createSignal<PopoverState>()
	const editMenuRefSignal = createSignal<HTMLButtonElement>()
	const editMenuStateSignal = createSignal<PopoverState>()

	const shownCodeDocuments = () => {
		const docs = Object.values(codeDocuments.all().value).filter((doc) => {
			return !doc.deletedAt
		})
		docs.sort((a, b) => a.index - b.index)
		return docs
	}

	return (
		<header class={css.root}>
			<IconButton refSignal={menuRefSignal} name="menu" tooltip={t('menu')} />
			<Menu elementRef={menuRefSignal} state={menuStateSignal}>
				<>
					<MenuButton startIconName="check">Hello</MenuButton>
					<MenuDivider />
					<MenuButton>Hello</MenuButton>
					<MenuButton refSignal={editMenuRefSignal} endIconName="chevronRight">
						Edit
					</MenuButton>
					<MenuChild elementRef={editMenuRefSignal} state={editMenuStateSignal}>
						<>
							<MenuButton startIconName="check">Hello</MenuButton>
							<MenuDivider />
							<MenuButton>Hello</MenuButton>
							<MenuButton endIconName="chevronRight">Edit</MenuButton>
						</>
					</MenuChild>
				</>
			</Menu>
			<ScrollArea class={css.scrollArea}>
				<div class={css.tabContainer}>
					<For each={shownCodeDocuments()}>
						{(doc) => (
							<div class={css.tabButtonWrapper}>
								<Button
									onClick={() => codeDocuments.activate(doc.id)}
									class={
										css.tabButtonVariant[
											doc.id === codeDocuments.activeId()
												? 'active'
												: 'inactive'
										]
									}
								>
									<Text variant="bodyXs">{doc.name}</Text>
								</Button>
								<IconButton
									name="close"
									tooltip={t('close')}
									onClick={() => codeDocuments.delete(doc.id)}
									class={
										css.closeTabVariant[
											doc.id === codeDocuments.activeId()
												? 'active'
												: 'inactive'
										]
									}
								/>
							</div>
						)}
					</For>
				</div>
			</ScrollArea>
			<IconButton
				name="add"
				tooltip={t('documentNew')}
				class={css.addTabButton}
				onClick={() => codeDocuments.create(t('untitled'))}
			/>
		</header>
	)
}
