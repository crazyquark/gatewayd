#!/bin/bash
# Refernce here: https://wiki.ripple.com/Sending_RPC_Commands
ACCOUNT="$1"
SECRET="$2"
if [ -z $ACCOUNT ]
        then
                ACCOUNT="r4gzWvzzJS2xLuga9bBc3XmzRMPH3VvxXg"
fi
if [ -z $SECRET ]
	then
		SECRET="shrixAzTwHCDGfYTMUFcqhwdWVzCp"
fi

curl -X POST -d '{ "method": "submit", "params": [ { "secret": "'"$SECRET"'", "tx_json": { "TransactionType": "AccountSet", "Account" : "'"$ACCOUNT"'", "SetFlag": "8" } } ] }' http://localhost:5005/


