const statement = require("./statement");
const plays = require("./plays.json");
const invoice = require("./invoice.json");

console.log(statement(invoice, plays));
