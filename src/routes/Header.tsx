import { Button } from '@/components/Button'
import { IconButton } from '@/components/IconButton'
import {
	type CodeDocument,
	useCodeDocuments,
} from '@/providers/CodeDocuments'
import { useI18n } from '@/providers/I18n'
import { ScrollArea } from '@/components/ScrollArea'
import { Popover } from '@/components/Popover'
import { Text } from '@/components/Text'
import { type Component, For, createSignal } from 'solid-js'
import * as css from './Header.css'

export const Header: Component = () => {
	const [t] = useI18n()
	const [
		codeDocuments,
		{ createCodeDocument, activateCodeDocument, deleteCodeDocument },
	] = useCodeDocuments()

	const [isMenuPopoverShown, setIsMenuPopoverShown] = createSignal(false)

	let menuButtonRef: HTMLButtonElement | undefined

	const shownCodeDocuments = () => {
		const docs: CodeDocument[] = []

		for (const doc of Object.values(codeDocuments().value)) {
			if (!doc.deletedAt) {
				docs.push(doc)
			}
		}

		docs.sort((a, b) => a.index - b.index)

		return docs
	}

	return (
		<header class={css.root}>
			<IconButton
				ref={menuButtonRef}
				name="menu"
				tooltip={t('menu')}
				onClick={() => setIsMenuPopoverShown(!isMenuPopoverShown())}
			/>
			<Popover
				when="click"
				hasArrow={true}
				virtualReference={menuButtonRef}
				shownOverride={isMenuPopoverShown}
				options={{
					placement: 'bottom-start',
					modifiers: [{ name: 'offset', options: { offset: [0, 13] } }],
				}}
				reference={() => <></>}
			>
				<div class={css.dropdown}>
					<div class={css.dropdownButtonContainer}>Hello world</div>
				</div>
			</Popover>
			<ScrollArea class={css.scrollArea}>
				<div class={css.tabContainer}>
					<For each={shownCodeDocuments()}>
						{(doc) => (
							<div class={css.tabButtonWrapper}>
								<Button
									onClick={[activateCodeDocument, doc.id]}
									class={
										css.tabButtonVariant[doc.isActive ? 'active' : 'inactive']
									}
								>
									<Text variant="bodyXs">{doc.name}</Text>
								</Button>
								<IconButton
									name="close"
									tooltip={t('close')}
									onClick={() => deleteCodeDocument(doc.id)}
									class={
										css.closeTabVariant[doc.isActive ? 'active' : 'inactive']
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
				onClick={() => createCodeDocument(t('untitled'))}
				class={css.addTabButton}
			/>
		</header>
	)
}
