There are prerequisites that have already been downloaded for using hyperledger fabric and this assumes that you have already downloaded said packages.
** WORK IN PROGRESS **

To start this application:

First, you will need to start the network and bring it up with:

./network.sh up createChannel

This will not only bring up the network that will allow us to deploy our chaincode but it will create a channel as well.

Second, you will need to deploy the chaincode by using this command for our javascript smart contract (chain code).

./network.sh deployCC -ccn basic -ccp ../work-blockchain/chaincode-js -ccl javascript

Once that's done, you will then need to run the application code to run the functions within the chaincode.
You will go to the directory application-javascript and when in that directory, you will then run npm install in order to install the necessary packages needed for this.

Once everything is installed, you can then run:

node app.js

** PROBLEMS **

Having problems with the Docker configuration at the moment that is causing the code to not work properly.
