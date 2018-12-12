import { Province } from './province';

const sampleProvinceData = () => {
	return {
		name: 'Asia',
		producers: [
			{ name: 'Byzantium', cost: 10, production: 9 },
			{ name: 'Attalia', cost: 12, production: 10 },
			{ name: 'Sinope', cost: 10, production: 6 }
		],
		demand: 30,
		price: 20
	};
};

describe('Province', () => {
	it('shortfall', () => {
		const asia = new Province(sampleProvinceData());
		expect(asia.shortfall).toEqual(5);
	});
});
