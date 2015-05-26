#!/bin/bash
# run this from the root folder
sudo -u postgres psql -c "drop database gatewayd_db"
sudo -u postgres psql -c "create database gatewayd_db with owner gatewayd_user encoding='utf8'"
grunt migrate
# info:  address=rBCPdrn7HnY8XB4dc674316iFq8s3s7F4, secret=shKAuRZkALboqFsiapGvzQXJfzLHf
bin/gateway set_cold_wallet rBCPdrn7HnY8XB4dc674316iFq8s3s7F4

