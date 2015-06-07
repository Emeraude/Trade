#!/usr/bin/env bash

cd `dirname $0`

[ $# -eq 1 ] && money=$1 || money=100000

for file in `ls examples/*.txt examples/*.TXT`; do
    echo -e "\033[36m$(basename $file)\033[0m"
    ./moulinette.php -f $file -p trade -m $money
done
