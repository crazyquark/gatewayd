#!/bin/bash
# Refernce here: https://wiki.ripple.com/Sending_RPC_Commands
ACCOUNT="$1"
if [ -z $ACCOUNT ]
        then
                ACCOUNT="rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
fi

curl -X POST -d '{ "method": "submit", "params": [ { "secret": "masterpassphrase", "tx_json": { "TransactionType": "AccountSet", "Account" : "'"$ACCOUNT"'", "SetFlag": "8" } } ] }' http://localhost:5005/


