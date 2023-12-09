import { Button } from '@/components/Button'
import { CodeEditor } from '@/components/CodeEditor'
import { useI18n } from '@/components/ProviderI18n'
import { useIcons } from '@/components/ProviderIcons'
import { usePortal } from '@/components/ProviderPortal'
import { useTheme } from '@/components/ProviderTheme'
import { RouteMainHeader } from '@/components/RouteMainHeader'
import { ScrollArea } from '@/components/ScrollArea'
import { clamp, decimalToPercentage } from '@/utils/misc'
import { type Component, createSignal } from 'solid-js'
import * as css from './RouteMain.css'

export const RouteMain: Component = () => {
	const [_, Symbols] = useIcons()
	const [t] = useI18n()
	const { Mounts } = usePortal()
	const [theme] = useTheme()

	let mainRef: HTMLDivElement | undefined
	let mainDOMRect: DOMRect | undefined

	const [width, setWidth] = createSignal(0.5)

	const widthPercentage = () => decimalToPercentage(width())

	const oppositeWidth = () => 1 - width()

	const oppositeWidthPercentage = () => decimalToPercentage(oppositeWidth())

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
			<RouteMainHeader />
			<main ref={mainRef} class={css.main}>
				<div
					class={css.viewContainer}
					style={{ width: `calc(${widthPercentage()} - 0.5px` }}
				>
					<ScrollArea class={css.viewBar}>
						<div class={css.viewBarInner}>
							<Button class={css.viewBarButtonVariant.active} text={t().code} />
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
							<Button class={css.viewBarButtonVariant.active} text={t().svg} />
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
