# Ripple Gateway Installation Instructions

The following are for a clean build of Ubuntu 14.04. If you have any problems please create an issue.

Before you start, make sure you have already installed [ripple-rest](https://github.com/ripple/ripple-rest).

All of these commands assume your are in the base of the cloned project directory (e.g. ~/gatewayd).

## Install

### [Node.js](http://stackoverflow.com/questions/16302436/install-nodejs-on-ubuntu-12-10) and dependencies

    sudo apt-get -y install git python-software-properties python g++ make libpq-dev
    sudo add-apt-repository -y ppa:chris-lea/node.js
    sudo apt-get -y update
    sudo apt-get -y install nodejs postgresql postgresql-client

### Install gatewayd's dependencies using NPM:

The user installing gatewayd's dependencies should be root user, or have a super user grant access to your user to the .npm directory.

    sudo npm install --global pg grunt grunt-cli forever db-migrate jshint
    sudo npm install pm2 -g --unsafe-perm
    npm install --save

### Configure [Postgres](https://help.ubuntu.com/community/PostgreSQL)

Create the postgres user for gatewayd:

    sudo -u postgres psql -c "create user gatewayd_user with password 'password'"

Create the database and grant the created user as owner:

    sudo -u postgres psql -c "create database gatewayd_db with owner gatewayd_user encoding='utf8'"
    
Create the corresponding test database:
    
    sudo -U postgres psql -c "create database gatewayd_db_test with owner gatewayd_user encoding='utf8'"    

#### Make any environment specific database changes to lib/data/database.json (It should work by default if you followed the above instructions)
 
     ...
     "test": {
         "dialect":"postgres",
         "database": "gatewayd_db_test",
         "user": "gatewayd_user",
         "password": "",
         "host": "localhost",
         "port": "5432",
         "logging": true
       },
       "development": {
         "dialect":"postgres",
         "database": "gatewayd_db",
         "user": "gatewayd_user",
         "password": "",
         "host": "localhost",
         "port": "5432",
         "logging": true
       },
       "staging": {
         "dialect":"postgres",
         "database": "",
         "user": "",
         "password": "",
         "host": "",
         "port": "",
         "logging": false
       },
     ...
 
### Use Grunt to configure the postgres database

     grunt migrate
 
### Use Grunt to configure the test postgres database

     export NODE_ENV=test
     grunt migrate  

## Running gatewayd

The executable is located at bin/gateway:

    bin/gateway start

## Configure gatewayd

Once gatewayd is installed, [configure your gateway](https://ripple.com/build/gatewayd/#configuration) wallets and server
