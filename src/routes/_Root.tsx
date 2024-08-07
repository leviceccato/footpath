import { Button } from '@/components/Button'
import { CodeEditor } from '@/components/CodeEditor'
import { ScrollArea } from '@/components/ScrollArea'
import { useI18n } from '@/providers/I18n'
import { useIcons } from '@/providers/Icons'
import { usePortal } from '@/providers/Portal'
import { useTheme } from '@/providers/Theme'
import { Header } from '@/routes/Header'
import { clamp, decimalToPercentage } from '@/utils/misc'
import { type Component, createMemo, createSignal } from 'solid-js'
import * as css from './_Root.css'

export const Root: Component = () => {
	const [_, Symbols] = useIcons()
	const [t] = useI18n()
	const { Mounts } = usePortal()
	const [theme] = useTheme()

	let mainRef: HTMLDivElement | undefined
	let mainDOMRect: DOMRect | undefined

	const [width, setWidth] = createSignal(0.5)

	const widthPercentage = createMemo(() => decimalToPercentage(width()))

	const oppositeWidthPercentage = () => decimalToPercentage(1 - width())

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
		<div class={`${theme().class} ${css.root}`} style={theme().vars}>
			<Symbols />
			<Header />
			<main ref={mainRef} class={css.main}>
				<div
					class={css.viewContainer}
					style={{ width: `calc(${widthPercentage()} - 0.5px` }}
				>
					<ScrollArea class={css.viewBar}>
						<div class={css.viewBarInner}>
							<Button
								text={t('code')}
								class={css.viewBarButtonVariant.active}
							/>
							<Button
								text={t('optimize')}
								class={css.viewBarButtonVariant.inactive}
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
							<Button text={t('svg')} class={css.viewBarButtonVariant.active} />
							<Button
								text={t('symbols')}
								class={css.viewBarButtonVariant.inactive}
							/>
							<Button
								text={t('data')}
								class={css.viewBarButtonVariant.inactive}
							/>
						</div>
					</ScrollArea>
					<div class={css.view}>
						<div class={css.viewSvg}>
							<iframe
								title={t('preview')}
								class={css.viewSvgInner}
								src="/?route=svg"
							/>
						</div>
					</div>
				</div>
			</main>
			<Mounts />
		</div>
	)
}
