import { Workspace } from '@rbxts/services';
import { Make } from 'index';

export = () => {
	it('should be able to create an instance', () => {
		const instance = Make('Part');
		expect(typeIs(instance, 'Instance')).to.equal(true);
	});

	it('should be able to parent the instance', () => {
		const instance = Make('Part', { Parent: Workspace });
		expect(instance.Parent).to.equal(Workspace);
	});

	it('should be able to add a single child', () => {
		const instance = Make('Part', { Children: Make('Part') });
		expect(instance.GetChildren().size()).to.equal(1);
	});

	it('should be able to add multiple children', () => {
		const instance = Make('Part', { Children: [Make('Part'), Make('Part')] });
		expect(instance.GetChildren().size()).to.equal(2);
	});
};
