import { For, type Component } from 'solid-js'
import * as css from './RouteMainHeader.css'
import { useI18n } from '@/components/ProviderI18n'
import { useIcons } from '@/components/ProviderIcons'
import {
	useCodeDocuments,
	type CodeDocument,
} from '@/components/ProviderCodeDocuments'
import Button from '@/components/Button'
import Text from '@/components/Text'
import VisuallyHidden from '@/components/VisuallyHidden'
import ScrollArea from '@/components/ScrollArea'
import TheMenu from '@/components/TheMenu'
import IconButton from '@/components/IconButton'

const RouteMainHeader: Component = () => {
	const [Icon] = useIcons()
	const [t] = useI18n()
	const [
		codeDocuments,
		{ createCodeDocument, activateCodeDocument, deleteCodeDocument },
	] = useCodeDocuments()

	const shownCodeDocuments = () => {
		let docs: CodeDocument[] = []

		Object.values(codeDocuments().value).forEach((doc) => {
			if (!doc.deletedAt) {
				docs.push(doc)
			}
		})

		docs.sort((a, b) => a.index - b.index)

		return docs
	}

	return (
		<header class={css.root}>
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
									tooltip={t().close}
									onClick={[deleteCodeDocument, doc.id]}
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
				tooltip={t().document.new}
				onClick={() => createCodeDocument(t().untitled)}
				class={css.addTabButton}
			/>
			<TheMenu class={css.menuContainer} />
		</header>
	)
}

export default RouteMainHeader
