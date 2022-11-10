type IsOptional<T, K extends keyof T> = {
	[K1 in Exclude<keyof T, K>]: T[K1]
} & { K?: T[K] } extends T
	? K
	: never

type OptionalKeys<T> = { [K in keyof T]: IsOptional<T, K> }[keyof T]

export function setDefaultProps<T>(
	props: T,
	defaultProps: Pick<T, OptionalKeys<T>>,
) {
	const existingProps = Object.getOwnPropertyDescriptors(props)
	Object.defineProperties(props, Object.getOwnPropertyDescriptors(defaultProps))
	Object.defineProperties(props, existingProps)
}
