export type Properties<T extends Instance> = WritableInstanceProperties<T> & {
	Children: Instance | Instance[];
	Parent: Instance;
};

export type ExtractSignalHandler<T> = T extends RBXScriptSignal<infer U> ? U : never;
export type Events<T extends Instance> = {
	[key in InstanceEventNames<T>]: ExtractSignalHandler<T[key]>;
};

/**
 * Modifies an instance with the specified properties.
 *
 * This applies the properties to the instance, including events
 * and then moves on to applying the children, and finally the
 * parent of the instance.
 * 
 * Note that this does NOT clear previous children, 
 * rather it will only parent all of the children 
 * to the instance if any were specified.
 *
 * @param instance The instance to modify.
 * @param props The properties to apply.
 * @returns The instance passed in.
 */
export function Modify<T extends Instance>(instance: T, props: Partial<Properties<T> & Events<T>>) {
	const parent = props.Parent;
	const children = props.Children;

	delete props.Parent;
	delete props.Children;

	for (const entry of pairs(props)) {
		const [key, value] = entry as [Exclude<keyof typeof props, 'Parent' | 'Children'>, any];

		const property = instance[key];
		if (typeIs(property, 'RBXScriptSignal')) property.Connect(value);
		else instance[key] = value;
	}

	if (children) {
		if (typeIs(children, 'Instance')) children.Parent = instance;
		else children.forEach((child) => (child.Parent = instance));
	}

	if (parent) instance.Parent = parent;

	return instance;
}

/**
 * Creates an instance with the specified properties and returns it.
 * This will create the instance and pass it to the
 * {@link Modify} function, which will apply the properties.
 *
 * @param className The type of instance to create.
 * @param props The properties to apply.
 * @returns The created instance.
 */
export function Make<T extends keyof CreatableInstances>(
	className: T,
	props: Partial<Properties<CreatableInstances[T]> & Events<CreatableInstances[T]>> = {},
) {
	const instance = new Instance(className);
	return Modify(instance, props);
}
