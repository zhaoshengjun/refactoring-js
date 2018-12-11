const statement = require('./statement');
const plays = require('./plays.json');
const invoice = require('./invoice.json')[0];

describe('Statement', () => {
	it('should works for text', () => {
		expect(statement(invoice, plays)).toContain(`Statement for BigCo`);
		expect(statement(invoice, plays)).toContain(`Hamlet: $650.00 (55 seats)`);
		expect(statement(invoice, plays)).toContain(`As You Like It: $490.00 (35 seats)`);
		expect(statement(invoice, plays)).toContain(`Othello: $500.00 (40 seats)`);
		expect(statement(invoice, plays)).toContain(`Amount owed is $1,640.00`);
		expect(statement(invoice, plays)).toContain(`You earned 43 credits`);
	});
	it.only('should works for html', () => {
		let html = statement(invoice, plays, 'html');
		expect(html).toContain('<h1>Statment for BigCo</h1>');
	});
});
