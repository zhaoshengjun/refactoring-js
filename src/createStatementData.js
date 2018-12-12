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
	switch (play.type) {
		case 'tragedy':
			return new TragedyCalculator(performance, play);
		case 'comedy':
			return new ComedyCalculator(performance, play);
		default:
			throw new Error('Unknown type:');
	}
}

class PerformanceCalculator {
	constructor(performance, play) {
		this.performance = performance;
		this.play = play;
	}

	get amount() {
		throw 'Not implemented!';
	}

	get volumeCredits() {
		let result = 0;
		// add volume credits
		result += Math.max(this.performance.audience - 30, 0);
		return result;
	}
}

class TragedyCalculator extends PerformanceCalculator {
	get amount() {
		let result = 40000;
		if (this.performance.audience > 30) {
			result += 1000 * (this.performance.audience - 30);
		}
		return result;
	}
}
class ComedyCalculator extends PerformanceCalculator {
	get amount() {
		let result = 30000;
		if (this.performance.audience > 20) {
			result += 1000 + 500 * (this.performance.audience - 20);
		}
		result += 300 * this.performance.audience;
		return result;
	}
	get volumeCredits() {
		return super.volumeCredits + Math.floor(this.performance.audience / 10);
	}
}
