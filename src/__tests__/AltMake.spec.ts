import { Lighting, Workspace } from '@rbxts/services';
import { Clone, Make, Modify } from 'index';

export = () => {
	it('should be able to create an instance', () => {
		const instance = Make('Part');
		expect(typeIs(instance, 'Instance')).to.equal(true);
		instance.Destroy();
	});

	it('should be able to parent the instance', () => {
		const instance = Make('Part', { Parent: Workspace });
		expect(instance.Parent).to.equal(Workspace);
		instance.Destroy();
	});

	it('should be able to add a single child', () => {
		const instance = Make('Part', { Children: Make('Part') });
		expect(instance.GetChildren().size()).to.equal(1);
		instance.Destroy();
	});

	it('should be able to add multiple children', () => {
		const instance = Make('Part', { Children: [Make('Part'), Make('Part')] });
		expect(instance.GetChildren().size()).to.equal(2);
		instance.Destroy();
	});

	it('should connect events properly', () => {
		let deparented = false;

		const instance = Make('Part', {
			Parent: Workspace,
			AncestryChanged: (_, parent) => {
				if (!parent) return;
				deparented = true;
			},
		});

		instance.Parent = undefined;
		expect(deparented).to.equal(true);
		instance.Destroy();
	});

	it('should be able to modify existing instances', () => {
		const newAmbient = Color3.fromRGB(255, 0, 0);
		Modify(Lighting, {
			Name: 'Not Lighting',
			Ambient: newAmbient,
		});

		expect(Lighting.Name).to.equal('Not Lighting');
		expect(Lighting.Ambient).to.equal(newAmbient);
	});

	it('should be able to clone existing instances', () => {
		const part = Make('Part');
		const clone = Clone(part, {
			Color: new Color3(0, 0, 0),
		});

		expect(part).to.never.equal(clone);
		expect(clone.Color).to.equal(new Color3(0, 0, 0));
	});
};
