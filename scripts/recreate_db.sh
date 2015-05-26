#!/bin/bash
sudo -u postgres psql -c "drop database gatewayd_db"
sudo -u postgres psql -c "create database gatewayd_db with owner gatewayd_user encoding='utf8'"
grunt migrate

