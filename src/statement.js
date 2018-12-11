function statement(invoice, plays) {
	const statementData = {};
	statementData.customer = invoice.customer;
	statementData.performances = invoice.performances.map(enrichPerformance);
	return renderPlainText(statementData, plays);

	function enrichPerformance(performance) {
		const result = Object.assign({}, performance);
		result.play = playFor(result);
		result.amount = amountFor(result);
		return result;
	}

	function playFor(performance) {
		return plays[performance.playID];
	}
	function amountFor(performance) {
		let result = 0;
		switch (performance.play.type) {
			case 'tragedy':
				result = 40000;
				if (performance.audience > 30) {
					result += 1000 * (performance.audience - 30);
				}
				break;
			case 'comedy':
				result = 30000;
				if (performance.audience > 20) {
					result += 1000 + 500 * (performance.audience - 20);
				}
				result += 300 * performance.audience;
				break;
			default:
				throw new Error(`unknown type:${performance.play.type}`);
		}
		return result;
	}
}

function renderPlainText(data, plays) {
	// main part
	let result = `Statement for ${data.customer}\n`;
	for (let perf of data.performances) {
		// print line for this order
		result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
	}
	result += `Amount owed is ${usd(totalAmount())} \n`;
	result += `You earned ${totalVolumeCredits()} credits\n`;
	return result;

	// helper functions

	function volumeCreditsFor(perf) {
		let result = 0;
		// add volume credits
		result += Math.max(perf.audience - 30, 0);
		// add extra credit for every ten comedy attendances
		if ('comedy' === perf.play.type) result += Math.floor(perf.audience / 10);
		return result;
	}

	function usd(amount) {
		return new Intl.NumberFormat('en-Us', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(amount / 100);
	}

	function totalVolumeCredits() {
		let result = 0;
		for (let perf of data.performances) {
			result += volumeCreditsFor(perf);
		}
		return result;
	}

	function totalAmount() {
		let result = 0;
		for (let perf of data.performances) {
			result += perf.amount;
		}
		return result;
	}
}

module.exports = statement;
