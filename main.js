#!/usr/bin/env node

var fs = require('fs');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// process.stdin.resume();
// process.stdin.setEncoding('utf8');
var capital;
var days;
var actions = 0;
var values = [];
var last = 0;

var costAction = 0;

function getArg(chunk, i) {
    if (i == 0)
	capital = chunk;
    else
	days = chunk;
};

function sell(n) {
    console.log('sell ' + n);
    actions -= n;
    capital += Math.ceil((values[last] - values[last] * 0.15 / 100)) * n;
}

function buy(n) {
    console.error('capital before is:' + capital + ' n is : ' + n);

    console.log('buy ' + n);
    actions += n;
    capital -= Math.ceil((values[last] + values[last] * 0.15 / 100)) * n;
    costAction = values[last];
    console.error('capital after is:' + capital);
}

function wait() {
    console.log('wait');
}

function getTrend() {

}

function getMMA(n) {
    var i = 0;
    var j = values.length - 1;
    var average = 0;

    for (i = 0; i < n && j >= 0 ; ++i) {
	average += values[j];
	--j;
    }
    average /= i;
    return (average);
}

function getEMA(n) {
    var i = 0;
    var j = values.length - 1;
    var average = 0;
    if (n > values.length - 1)
	n = values.length - 1;
    else
	n = values.length - 1 - n;
    // MACRO
    for (i = n; i < values.length - 1; ++i) {
	average = average * 0.91 + values[i] * 0.09;
    }
    return (average);
}

function getMACD() {
    return (getEMA(12) - getEMA(26));
}

function decisionMaker(day) {
    var mma150 = getMMA(150);
    var mma30 = getMMA(30);
    var mma5 = getMMA(5);
    var ema12 = getEMA(12);
    var macd = getMACD();

    console.error('EMA12 is: ' + ema12);
    console.error('MACD is: ' + macd);
    if (ema12 < mma5)
	console.error('inferior: ' + (mma5 - ema12));
    else
	console.error('superior');

    console.error('mma150 is: ' + mma150);
    console.error('mma30 is: ' + mma30);
    console.error('mma5 is: ' + mma5);
    console.error('capital is: ' + capital);
    if (macd < 0 && actions > 0)
    	sell(actions);
    else if (macd > 0 && capital > values[last])
    	buy(Math.floor(capital / Math.ceil((values[last] + (values[last] * 0.15) / 100))));
    else
    	wait();
    // if (mma5 < mma30 && actions > 0)
    // 	sell(actions);
    // else if (mma5 > mma30 && capital > values[last])
    // 	buy(Math.floor(capital / Math.ceil((values[last] + (values[last] * 0.15) / 100))));
    // else
    // 	wait();
}

function main() {
    var i = 0;
    rl.on('line', function (data) {

    	console.error("\nindex: " + i);
	console.error('capital is :' + capital);
	// console.error('days: ' + days)
	// console.error('data: ' + data + "\n")
 	// console.error('actions are :' + actions);
    	if (data.match(/\-end\-/i))
    	    process.exit(0);
    	else if (i < 2)
    	    getArg(data, i);
	else if (last == days)
	    sell(actions, actions);
	else if (i > days)
	    wait();
    	else if (i > 2) {
    	    values.push(parseInt(data, 10));
	    decisionMaker(last);
	    ++last;
	}
	else
	    wait();
    	fs.writeFile("tmp.txt", data);
    	i = i + 1;
    });
}

main();
