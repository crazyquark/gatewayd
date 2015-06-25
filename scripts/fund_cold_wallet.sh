#!/bin/bash
command -v js24 >/dev/null || sudo apt-get install libmozjs-24-bin 

echo "Funding with XRP"
result=`curl -X POST -d '{ "method": "sign", "params": [ { "offline": false, "secret": "masterpassphrase", "tx_json": { "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "Amount": "999000000", "Destination": "r4gzWvzzJS2xLuga9bBc3XmzRMPH3VvxXg", "TransactionType": "Payment" } } ] }' http://localhost:5005/`
tx_blob=`echo $result | ./jsawk -j js24 'return this.result.tx_blob'`

curl -X POST -d '{ "method": "submit", "params": [ { "tx_blob": "'"$tx_blob"'" } ] }' http://localhost:5005/

