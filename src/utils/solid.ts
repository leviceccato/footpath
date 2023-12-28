import { mergeProps } from 'solid-js'

export type ClassProps = { class?: string }

type PickOptionals<TValue> = {
	[TKey in keyof TValue as TValue extends Record<TKey, TValue[TKey]>
		? never
		: TKey]-?: TValue[TKey]
}

// Make default prop declarations cleaner and more type-safe
export function defaultProps<
	TProps,
	TdefaultProps extends Partial<PickOptionals<TProps>>,
>(props: TProps, defaultProps: TdefaultProps) {
	return mergeProps(defaultProps, props)
}

// Similar to defaultProps, except it works for regular objects
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
