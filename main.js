#!/usr/bin/env node
 
process.stdin.resume();
process.stdin.setEncoding('utf8');
var capital;
var days;
var data;

function getArg(chunk, i) {
    if (i == 0)
	capital = chunk;
    else
	days = chunk;
};

function sell(n) {
    console.log('sell ' + n);
}

function buy(n) {
    console.log('buy ' + n);
}

function wait() {
    console.log('wait');
}

function main() {
    var i = 0;
    var values = [];

    process.stdin.on('data', function (chunk) {
	
	if (chunk == '-END-\n')
	    process.exit(0);
	if (i < 2)
	    getArg(chunk, i);
	else {
	    values.push(chunk);
	    if (i > 2 && values[values.length - 1] < values[values.length - 2])
		sell(2);
	    else
		buy(5);
	}
	i = i + 1;;
    });
}

main();
