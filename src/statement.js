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
}

function htmlStatement(invoice, plays) {
	return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
	let result = `
  <h1>Statment for ${data.customer}</h1>
  <table>
    <tr>
      <th>play</th>
      <th>seats</th>
      <th>cost</th>
    </tr>`;

	for (let perf of data.performances) {
		result += `
    <tr>
      <td>${perf.play.name}</td>
      <td>${perf.audience}</td>
      <td>${usd(perf.amount)}</td>
    </tr>
    `;
	}
	result += `
  </table>
  <p>Amount owed is <em>${usd(data.totalAmount)}</em></p>  
  <p>You earned <em>${data.totalVolumeCredits}</em> credits</p>
  `;
	return result;
}
function usd(amount) {
	return new Intl.NumberFormat('en-Us', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2
	}).format(amount / 100);
}

module.exports = statement;
