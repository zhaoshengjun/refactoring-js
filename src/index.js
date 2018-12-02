const statement = require("./statement");
const plays = require("./plays.json");
const invoice = require("./invoice.json")[0];

console.log(statement(invoice, plays));
