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

function getArg(chunk, i) {
    if (i == 0)
	capital = chunk;
    else
	days = chunk;
};

function sell(n) {
    console.log('sell ' + n);
    actions -= n;
}

function buy(n) {
     // process.stdout.write('buy ' + n);
    console.log('buy ' + n);
    actions += n;
}

function wait() {
    console.log('wait');
}

function main() {
    var i = 0;
    var values = [];
    rl.on('line', function (chunk) {

    	console.error("index: " + i);
	console.error('days: ' + days)
	console.error('data: ' + chunk + "\n")
	    console.error('actions are :' + actions);
    	if (chunk.match(/\-end\-/i)) {
    	    process.exit(0);
	}
    	else if (i < 2) {
    	    getArg(chunk, i);
    	}
	else if (i - 1 == days) {
	    sell(actions, actions);
	    console.error('selling everything at: ' + i + 'action: ' + actions);
	}
	else if (i > days)
	    wait()
    	else {
    	    values.push(parseInt(chunk, 10));
    	    if (i > 2 && capital > values[values.length - 1]
		&& values[values.length - 1] > values[values.length - 2])
    	    	buy(3);
    	    else if (actions > 0)
    	    	sell(1);
	    else
		wait()
    	}
    	fs.writeFile("tmp.txt", chunk);
    	i = i + 1;
    });
}

main();
