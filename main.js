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
    process.stdout.write('sell ' + n + '\n');
}

function buy(n) {
    process.stdout.write('buy ' + n + '\n');
}

function wait() {
    process.stdout.write('wait' + '\n');
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
