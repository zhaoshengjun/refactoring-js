export default function createStatementData(invoice, plays) {
	const statementData = {};
	statementData.customer = invoice.customer;
	statementData.performances = invoice.performances.map(enrichPerformance);
	statementData.totalAmount = totalAmount(statementData);
	statementData.totalVolumeCredits = totalVolumeCredits(statementData);
	return statementData;
	function enrichPerformance(performance) {
		const calculator = createPerformanceCalculator(performance, playFor(performance));
		const result = Object.assign({}, performance);
		result.play = calculator.play;
		result.amount = calculator.amount;
		result.volumeCredits = calculator.volumeCredits;
		return result;
	}

	function playFor(performance) {
		return plays[performance.playID];
	}
	function totalVolumeCredits(data) {
		return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
	}
	function totalAmount(data) {
		return data.performances.reduce((total, p) => total + p.amount, 0);
	}
}

function createPerformanceCalculator(performance, play) {
	return new PerformanceCalculator(performance, play);
}

class PerformanceCalculator {
	constructor(performance, play) {
		this.performance = performance;
		this.play = play;
	}

	get amount() {
		let result = 0;
		switch (this.play.type) {
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
				throw new Error(`unknown type:${this.play.type}`);
		}
		return result;
	}

	get volumeCredits() {
		let result = 0;
		// add volume credits
		result += Math.max(this.performance.audience - 30, 0);
		// add extra credit for every ten comedy attendances
		if ('comedy' === this.play.type) result += Math.floor(this.performance.audience / 10);
		return result;
	}
}
