#!/usr/bin/env node

var fs = require('fs');
 
process.stdin.resume();
process.stdin.setEncoding('utf8');
var capital;
var days;

function getArg(chunk, i) {
    if (i == 0)
	capital = chunk;
    else
	days = chunk;
};

function sell(n) {
    console.log('sell ' + n);
    // process.stdout.write('sell ' + n);
}

function buy(n) {
    // process.stdout.write('buy ' + n);
    console.log('buy ' + n);
}

function wait() {
    console.log('wait');
}

function main() {
    var i = 0;
    var values = [];

    process.stdin.on('data', function (chunk) {

	if (chunk == '--end--\n')
	    process.exit(0);
	if (i < 2) {
	    getArg(chunk, i);
	}
	else {
	    console.log("index: " + i);
	    values.push(chunk);
	    if (i > 2 && values[values.length - 1] < values[values.length - 2])
	    	sell(2);
	    else
	    	buy(5);
	fs.writeFile("tmp.txt", chunk);
	}
	i = i + 1;
    });
}

main();
