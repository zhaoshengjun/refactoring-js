const createStatementData = require('./createStatementData');

function statement(invoice, plays) {
	return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
	// main part
	let result = `Statement for ${data.customer}\n`;
	for (let perf of data.performances) {
		// print line for this order
		result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
	}
	result += `Amount owed is ${usd(data.totalAmount)} \n`;
	result += `You earned ${data.totalVolumeCredits} credits\n`;
	return result;

	// helper functions

	function usd(amount) {
		return new Intl.NumberFormat('en-Us', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(amount / 100);
	}
}

module.exports = statement;
