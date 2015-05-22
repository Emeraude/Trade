#!/usr/bin/env node

var fs = require('fs');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// process.stdin.resume();
// process.stdin.setEncoding('utf8');
var capital = 0;
var days = 0;
var actions = 0;

var values = [];
var macdTab = [];

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

function getMMA(data, n) {
    var i = 0;
    var j = last + 1;
    var average = 0;

    for (i = 0; i <= n && j >= 0 ; ++i) {
	average += data[j];
	--j;
    }
    average /= i;
    return (average);
}


var EMAcoef = 0.10;
function getEMA(n) {
    var i = 0;
    var average = 0;

    if (n > values.length)
	n = values.length;
    else
	n = values.length - n;

    for (i = n; i <= last; ++i) {
	average = average * (1 - EMAcoef) + values[i] * EMAcoef;
    }
    return average;
}

function getMACD() {
    return getEMA(12) - getEMA(26);
}

var kTab = [];
function getStochastique(n2) {
    var k;
    var d;

    var i = 0;
    var highest = values[last]; //highest hight
    var lowest = values[last]; // lowest low

    console.error("i is :" + i + ", last: " + last + ", n: " + n2);
    if (n2 > last)
	n2 = last + 1;
    else
	n2 = last - n2 + 1;

    for (i = n2; i < last; ++i) {
	console.error(values[i]);
	if (lowest > values[i])
	    lowest = values[i];
	if (highest < values[i])
	    highest = values[i];
    }
    console.error('last: '+ values[last]);
    console.error("");
    console.error("highest is :" + highest);
    console.error("lowest is :" + lowest);

    //should not be values which is from open, should be close
    k = 100 * ( (values[last] - lowest) / (highest - lowest) );
    kTab.push(k);
    d = 3 - getMMA(kTab, 12);
    console.error("k is :" + k);
    return k;
}

function getMaxActionToBuy() {
    return Math.floor(capital / Math.ceil((values[last] + (values[last] * 0.15) / 100)));
}

function decisionMaker(day) {
    var mma150 = getMMA(values, 150);
    var mma30 = getMMA(values, 30);
    var mma5 = getMMA(values, 5);
    var ema12 = getEMA(12);
    var macd = getMACD();
    var stoch = getStochastique(14);

    // console.error('EMA12 is: ' + ema12);
    // console.error('MACD is: ' + macd);
    // if (ema12 < mma5)
    // 	console.error('inferior: ' + (mma5 - ema12));
    // else
    // 	console.error('superior');
    // console.error('mma150 is: ' + mma150);
    // console.error('mma30 is: ' + mma30);
    // console.error('mma5 is: ' + mma5);
    // console.error('capital is: ' + capital);

    if (stoch > 80 && actions > 0)
    	sell(actions);
    else if (stoch < 20 && capital > values[last])
    	buy(getMaxActionToBuy());
    else
    	wait();   

    // var tmp = getMMA(macdTab, 10);
    // if (tmp < macd && actions > 0)
    // 	sell(actions);
    // else if (macd > 0 || tmp > macd && capital > values[last])
    // 	buy(getMaxActionToBuy());
    // else
    // 	wait();

    //do not work
    // if (macd < 0 && actions > 0)
    // 	sell(actions);
    // else if (macd > 0 && capital > values[last])
    // 	buy(getMaxActionToBuy());
    // else
    // 	wait();

    // if (mma5 < mma30 && actions > 0)
    // 	sell(actions);
    // else if (mma5 > mma30 && capital > values[last])
    // 	buy(getMaxActionToBuy());
    // else
    // 	wait();

}

function main() {
    var i = 0;
    rl.on('line', function (data) {

    	// console.error("\nindex: " + i + ' || ' + last);
	// console.error('capital is :' + capital);
	// console.error('days: ' + days)

	// console.error('data: ' + data + "\n")
 	// console.error('actions are :' + actions);

    	if (data.match(/\-end\-/i))
    	    process.exit(0);
	    // return (0);
    	else if (i < 2)
    	    getArg(data, i);
	else if (i - 1 == days)
	    sell(actions, actions);
	else if (i > days)
	    wait();
    	else if (i > 2) {
    	    values.push(parseInt(data, 10));
	    macdTab.push(getMACD());
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
