#!/bin/bash
# Reference here: https://wiki.ripple.com/Sending_RPC_Commands
ACCOUNT="$1"
SECRET="$2"
if [ -z $ACCOUNT ]
        then
                ACCOUNT="rNfFpabLoQdemismSSwTWBy5NEtD8RdFHL"
fi
if [ -z $SECRET ]
	then
		SECRET="ss7UiTtTVJYXfSNGAkTPLDRD8Tmpd"
fi

curl -v -H "Content-Type: application/json" -X POST --data-binary '{ "secret": "'"$SECRET"'", "trustline": { "limit": "100",  "currency": "EUR",  "counterparty": "r4gzWvzzJS2xLuga9bBc3XmzRMPH3VvxXg", "account_allows_rippling": true } }' http://localhost:5990/v1/accounts/$ACCOUNT/trustlines
