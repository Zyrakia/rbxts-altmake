# Altmake

An alternative to `@rbxts/make` which removes children rebuilding to try to get a bit of a Typescript speedup, since it's painfully slow to use, at least for me.
I also added the ability to add a single child without turning it into an array.
Overall it's only marginally slower at runtime, like microseconds speaking, and I like using it more so, use it if you want.

This package also has a `Modify` function, which let's you adjust properties of an instance all at once.
The `Make` function basically just creates an instance, passes it to the `Modify` function and then returns it.
Like in `@rbxts/make`, all properties are applied, then children, then finally the parent.

# Example

```ts
const part = Make('Part', {
	Parent: Workspace,
	Name: "Look at me, I'm a Part!",
    	Touched: (hit) => print(`Get away from me ${hit.Parent ? hit.Parent : hit}!`)
	Children: Make('Part'),
});
```