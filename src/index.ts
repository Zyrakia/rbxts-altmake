export type Properties<T extends keyof CreatableInstances> = WritableInstanceProperties<
	CreatableInstances[T]
> & {
	Children: Instance | Instance[];
	Parent: Instance;
};

export type ExtractSignalHandler<T> = T extends RBXScriptSignal<infer U> ? U : never;
export type Events<T extends keyof CreatableInstances> = {
	[key in InstanceEventNames<CreatableInstances[T]>]: ExtractSignalHandler<
		CreatableInstances[T][key]
	>;
};

export function Make<T extends keyof CreatableInstances>(
	className: T,
	props: Partial<Properties<T> & Events<T>> = {},
) {
	const instance = new Instance(className);

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
