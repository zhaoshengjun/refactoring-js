export default function createStatementData(invoice, plays) {
	const statementData = {};
	statementData.customer = invoice.customer;
	statementData.performances = invoice.performances.map(enrichPerformance);
	statementData.totalAmount = totalAmount(statementData);
	statementData.totalVolumeCredits = totalVolumeCredits(statementData);
	return statementData;
	function enrichPerformance(performance) {
		const calculator = new PerformanceCalculator(performance, playFor(performance));
		const result = Object.assign({}, performance);
		result.play = calculator.play;
		result.amount = calculator.amount;
		result.volumeCredits = volumeCreditsFor(result);
		return result;
	}

	function playFor(performance) {
		return plays[performance.playID];
	}

	function volumeCreditsFor(perf) {
		let result = 0;
		// add volume credits
		result += Math.max(perf.audience - 30, 0);
		// add extra credit for every ten comedy attendances
		if ('comedy' === perf.play.type) result += Math.floor(perf.audience / 10);
		return result;
	}
	function totalVolumeCredits(data) {
		return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
	}
	function totalAmount(data) {
		return data.performances.reduce((total, p) => total + p.amount, 0);
	}
}

class PerformanceCalculator {
	constructor(performance, play) {
		this.performance = performance;
		this.play = play;
	}

	get amount() {
		let result = 0;
		switch (this.performance.play.type) {
			case 'tragedy':
				result = 40000;
				if (this.performance.audience > 30) {
					result += 1000 * (this.performance.audience - 30);
				}
				break;
			case 'comedy':
				result = 30000;
				if (this.performance.audience > 20) {
					result += 1000 + 500 * (this.performance.audience - 20);
				}
				result += 300 * this.performance.audience;
				break;
			default:
				throw new Error(`unknown type:${this.performance.play.type}`);
		}
		return result;
	}
}
