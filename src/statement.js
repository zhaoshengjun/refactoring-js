function statement(invoice, plays) {
  // main part
  let totalAmount = 0;
  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    // print line for this order
    result += `  ${playFor(perf).name}: ${usd(
      amountFor(perf, playFor(perf))
    )} (${perf.audience} seats)\n`;
    totalAmount += amountFor(perf, playFor(perf));
  }

  result += `Amount owed is ${usd(totalAmount)} \n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  // helper functions
  function playFor(performance) {
    return plays[performance.playID];
  }

  function amountFor(performance) {
    let result = 0;
    switch (playFor(performance).type) {
      case "tragedy":
        result = 40000;
        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (performance.audience > 20) {
          result += 1000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        break;
      default:
        throw new Error(`unknown type:${playFor(performance).type}`);
    }
    return result;
  }

  function volumeCreditsFor(perf) {
    let result = 0;
    // add volume credits
    result += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendances
    if ("comedy" === playFor(perf).type)
      result += Math.floor(perf.audience / 10);
    return result;
  }

  function usd(amount) {
    return new Intl.NumberFormat("en-Us", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount / 100);
  }

  function totalVolumeCredits() {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
      volumeCredits += volumeCreditsFor(perf);
    }
    return volumeCredits;
  }
}

module.exports = statement;
