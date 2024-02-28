import { createRoot, mergeProps, onCleanup } from 'solid-js'

export type ClassProps = { class?: string }

type PickOptionals<TValue> = {
	[TKey in keyof TValue as TValue extends Record<TKey, TValue[TKey]>
		? never
		: TKey]-?: TValue[TKey]
}

/* Make default prop declarations cleaner and more type-safe */
export function defaultProps<
	TProps,
	TdefaultProps extends Partial<PickOptionals<TProps>>,
>(props: TProps, defaultProps: TdefaultProps) {
	return mergeProps(defaultProps, props) as Required<TdefaultProps> & TProps
}

/* Similar to defaultProps, except it works for regular objects */
export function defaultValues<
	TObject,
	TDefaultProperties extends Partial<PickOptionals<TObject>>,
>(
	object: TObject,
	defaultProperties: TDefaultProperties,
): Required<TDefaultProperties> & TObject {
	return { ...object, ...defaultProperties } as Required<TDefaultProperties> &
		TObject
}

/* Event listener util that will automatically unregister itself when the component is cleaned up */
export function useEventListener(
	options: {
		name: string
		target: EventTarget
		handler: EventListener
	} & AddEventListenerOptions,
): void {
	createRoot(() => {
		options.target.addEventListener(options.name, options.handler, options)
		onCleanup(() => {
			options.target.removeEventListener(options.name, options.handler, options)
		})
	})
}
