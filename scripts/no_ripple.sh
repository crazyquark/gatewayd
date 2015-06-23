#!/bin/bash
# Refernce here: https://wiki.ripple.com/Sending_RPC_Commands
curl -X POST -d '{ "method": "submit", "params": [ { "secret": "masterpassphrase", "tx_json": { "TransactionType": "AccountSet", "Account" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "SetFlag": "8" } } ] }' http://localhost:5005/


