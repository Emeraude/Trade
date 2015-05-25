#!/usr/bin/env bash

cd `dirname $0`

cat > toto.js <<EOF
\$(function() {
\$('div').highcharts({
title: 'Trade',
series: [
EOF

for file in `ls *.txt`; do
    echo "{name: '$file', data:" >> toto.js
    cat $file >> toto.js
    echo '},' >> toto.js
done

cat >> toto.js <<EOF
]});
\$('text:contains(Highcharts.com)').remove();
});
EOF
