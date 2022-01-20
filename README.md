# Altmake

An alternative to `@rbxts/make` which removes children rebuilding to try to get a bit of a Typescript speedup.
All credits to the author of `@rbxts/make` ([@Validark](https://github.com/Validark)), it's a clever package and a great utility, and there is no reason to switch if you need the children
rebuilding aspect.

There are some notable differences, such as the `Modify` function, which lets you modify an existing instance instead of creating a new one, which can be pretty handy, and letting you pass a single instance instead of an array as the children property if you wish.

Note that the `Modify` function should not be used to modify like one or two properties since it will most likely present a slowdown because of all of the things it does besides `instance.X = Y`.

# Example

```ts
const part = Make('Part', {
	Parent: Workspace,
	Name: "Look at me, I'm a Part!",
    	Touched: (hit) => print(`Get away from me ${hit.Parent ? hit.Parent : hit}!`)
	Children: Make('Part'),
});
```

```ts
Modify(Lighting, {
	Name: 'Not Lighting',
	Ambient: Color3.fromRGB(255, 0, 0),
});
```
