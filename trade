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
var mma5Tab = [];
var mma30Tab = [];
var mma150Tab = [];
var ema12Tab = [];
var ema24Tab = [];
var last = 0;

var costAction = 0;
var history = [];

function getArg(chunk, i) {
    if (i == 0)
	capital = chunk;
    else
	days = chunk;
};

function getMaxActionToBuy() {
    var n = capital / (values[last] + Math.ceil(values[last] * 0.15 / 100));
    return Math.floor(n);
}

function sell(n) {
    if (!n) {
	wait();
	return ;
    }

    console.log('sell ' + n);
    actions -= n;
    // capital += Math.ceil(values[last] * n * 0.15 / 100)
    capital += values[last] * n - Math.ceil(values[last] * n * 0.15 / 100);
    history.push(-n);
}

function buy(n) {
    if (!n) {
    	wait();
    	return ;
    }
    // else 
    console.error('capital before is:' + capital + ' n is : ' + n);
    console.log('buy ' + n);
    actions += n;
    // capital -= Math.ceil(values[last] * n * 1.15);
    capital -= values[last] * n + Math.ceil(values[last] * n * 0.15 / 100);
    costAction = values[last];
    console.error('capital after is:' + capital);
    history.push(n);
}

function wait() {
    console.log('wait');
}

function getMMA(data, n) {
    var i = 0;
    var j = last;
    var average = 0;

    for (i = 0; i < n && j >= 0 ; ++i) {
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

    if (n > last)
	n = last;
    else
	n = last - n;

    for (i = n; i <= last; ++i) {
	// console.error("[" + n + "] " + values[i]);
	average = average * (1 - EMAcoef) + values[i] * EMAcoef;
    }
    return average;
}

function getMACD() {
    return getEMA(12) - getEMA(26);
}

var kTab = [];
var dTab = [];
function getStochastique(n2) {
    var k;
    var d;

    var i = 0;
    var highest = values[last]; //highest hight
    var lowest = values[last]; // lowest low

    // console.error("i is :" + i + ", last: " + last + ", n: " + n2);
    if (n2 > last)
	n2 = last + 1;
    else
	n2 = last - n2 + 1;

    for (i = n2; i < last; ++i) {
	// console.error(values[i]);
	if (lowest > values[i])
	    lowest = values[i];
	if (highest < values[i])
	    highest = values[i];
    }

    //should not be values which is from open, should be close
    k = 100 * ( (values[last] - lowest) / (highest - lowest) );
    kTab.push(k);
    d = 3 - getMMA(kTab, 12);
    dTab.push(d);
    // console.error("k is :" + k);
    return k;
}

function getQuickFall() {
    if (last < 3)
	return ;
    var n = 3;
    var mma3 = getMMA(values, 3);

    var i = 0;
    var j = last - 1;
    var average = 0;

    for (i = 0; i < n && j >= 0 ; ++i) {
	average += values[j];
	--j;
    }
    var firstVal = average / i;

    i = 0;
    j = last - 2;
    average = 0;
    for (i = 0; i < n && j >= 0 ; ++i) {
	average += values[j];
	--j;
    }

    var secondVal = average / i;

    if (mma3 < firstVal && mma3 < secondVal)
	return 0;


    return (firstVal - secondVal > mma3 - firstVal);

    return mma3 - average;
}

function decisionMaker(day) {
    var mma150 = getMMA(values, 150);
    var mma80 = getMMA(values, 80);
    var mma30 = getMMA(values, 30);
    var mma5 = getMMA(values, 5);
    var ema12 = getEMA(12);
    var ema24 = getEMA(24);
    var macd = getMACD();
    var stoch = getStochastique(14);


    mma5Tab.push(mma5);
    mma30Tab.push(mma30);
    mma150Tab.push(mma150);
    ema12Tab.push(ema12);
    ema24Tab.push(ema24);

    // console.error('EMA12 is: ' + ema12);
    // console.error('MACD is: ' + macd);
    // console.error('mma150 is: ' + mma150);
    // console.error('mma30 is: ' + mma30);
    // console.error('mma5 is: ' + mma5);
    // console.error('capital is: ' + capital);

    // last days
    if (day > days - 20 && mma5 < mma30) {
	if (values[last] < values[last - 1] && values[last] < values[last - 2])
    	    sell(actions);
	else
	    wait();
    }
    else if (getMMA(values, day) < values[last]) {
    	var tmp = getMMA(macdTab, 10);
	if ((mma5 < mma30 && kTab[last] > 80) || (kTab[last] > 80) && tmp < macd)
    	    sell(actions);
    	else if ((kTab[last] < 20 && tmp > macd))
    	    buy(getMaxActionToBuy());
    	else
    	    wait();
    } else {
	
    	var tmp = getMMA(macdTab, 10);
	if ((mma5 < mma30 && kTab[last] > 80) || (kTab[last] > 80) && tmp < macd)
    	    sell(actions);
    	else if ((mma5 > mma30 && kTab[last]) || (kTab[last] < 20 && tmp > macd))
    	    buy(getMaxActionToBuy());
    	else
    	    wait();
    }

	// if (kTab[last] > 80)
	// 	sell(actions);
	// else if (kTab[last] < 20)
	// 	buy(Math.floor(getMaxActionToBuy() / 1));
	// else
	// 	wait();   

    // var tmp = getMMA(macdTab, 10);
    // if (tmp < macd)
    // 	sell(actions);
    // else if (macd > 0 || tmp > macd)
    // 	buy(getMaxActionToBuy());
    // else
    // 	wait();

    // do not work
    // if (macd < 0)
    // 	sell(actions);
    // else if (macd > 0)
    // 	buy(getMaxActionToBuy());
    // else
    // 	wait();

    // if (mma5 < mma30)
    // 	sell(actions);
    // else if (mma5 > mma30)
    // 	buy(getMaxActionToBuy());
    // else
    // 	wait();

}

var dir = "print/";

function main() {
    var i = 0;
    rl.on('line', function (data) {

    	console.error("\nindex: " + i + ' || ' + last);
	console.error('capital is :' + capital);
	// console.error('days: ' + days)

	console.error('data: ' + data + "\n")
 	// console.error('actions are :' + actions);

    	if (data.match(/\-end\-/i)) {
    	    process.exit(0);
	}
    	else if (i < 2)
    	    getArg(data, i);
	else if (i - 1 == days)
	    sell(actions, actions);
	else if (i > days)
	    wait();
    	else if (i > 2) {
    	    values.push(parseInt(data, 10));
	fs.writeFile(dir + "ibm_data.txt", JSON.stringify(values));
	fs.writeFile(dir + "ibm_ktab.txt", JSON.stringify(kTab));
	fs.writeFile(dir + "ibm_macd.txt", JSON.stringify(macdTab));
	fs.writeFile(dir + "ibm_dtab.txt", JSON.stringify(dTab));
	fs.writeFile(dir + "ibm_mma5.txt", JSON.stringify(mma5Tab));
	fs.writeFile(dir + "ibm_mma30.txt", JSON.stringify(mma30Tab));
	fs.writeFile(dir + "ibm_mma150.txt", JSON.stringify(mma150Tab));
	fs.writeFile(dir + "ibm_ema12.txt", JSON.stringify(ema12Tab));
	fs.writeFile(dir + "ibm_ema24.txt", JSON.stringify(ema24Tab));
	    macdTab.push(getMACD());
	    decisionMaker(last);
	    ++last;
	}
	else
	    wait();
    	i = i + 1;
    });
    return (i);
}

main();
