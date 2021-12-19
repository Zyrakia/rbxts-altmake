import { Workspace } from '@rbxts/services';
import { Make } from 'index';

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
};
