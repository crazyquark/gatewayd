#!/bin/bash
rippled stop
. recreate_db.sh
screen -dmS rippled rippled --fg --verbose --start
echo "Waiting 120 seconds for rippled to come online"
sleep 120
. no_ripple.sh
zsh -c ./fund_cold_wallet.sh


