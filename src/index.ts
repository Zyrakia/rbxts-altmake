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
	if (props === {}) return instance;

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

/**
 * Clones an instance and applies the specified properties to the new
 * instance. By default, roblox-ts types `.Clone()` as always returning
 * an instance, but there is a tiny chance that the instance which is
 * being cloned has `Archivable` set to false, which means cloning it
 * will return undefined (most notably, player characters). To account for
 * this, this function will, by default, set `Archivable` to true. If
 * manually disabled, the typings for this function will change, indicating
 * a possible undefined return.
 *
 * @param instance The instance to clone.
 * @param props The properties to apply.
 * @param ensureArchivable Whether to set archivable to true automatically, defaults to true.
 * @returns The cloned instance.
 */
export function Clone<T extends Instance, E extends boolean = true>(
	instance: T,
	props: Partial<Properties<T> & Events<T>> = {},
	ensureArchivable?: E,
): E extends true ? T : T | undefined {
	if (ensureArchivable ?? true) instance.Archivable = true;

	const clone = instance.Clone();
	if (!clone) return undefined as any;

	return Modify(clone, props);
}
