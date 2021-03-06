# Prerequisites
There are prerequisites that have already been downloaded for using hyperledger fabric and this assumes that you have already downloaded said packages.
This prerequisites are also different for Windows and MacOS, unsure how this would work on Linux.

## Requirements:

### MacOS:
Curl      <br/>
Homebrew  <br/>
Git       <br/>
Go        <br/>
jq        <br/>
SoftHSM   <br/>
Docker Desktop   <br/>

### Windows:

Curl      <br/>
'uname' command (part of Git, but only works with 64bit systems) <br/>
Git       <br/>
Go        <br/>
jq        <br/>
SoftHSM   <br/>
Docker    <br/>

### Note for Windows:
  You should use the Docker Quickstart Terminal for the terminal commands if running on Windows.
  Also, make sure to use a location under one of your shared drives. There is more documentation on Docker for this.
  
  Before running any ```git clone``` commands, run the following commands:
  ```
  git config --global core.autocrlf false
  git config --global core.longpaths true
  ```
  In order to check the settings of these parameters, you can just run the commands without the booleans.
  ```
  git config --global core.autocrlf
  git config --global core.longpaths
  ```
  
  core.autocrlf must be set to false so make sure that it is.
  
### Configuring SoftHSM

SoftHSM helps satisfy the requirement of interacting with hardware security modules that store cryptographic information.

In order to configure this, you will just need to copy ```/etc/softhsm2.conf``` to ```$HOME/.config/softhsm2/sonfthsm2.conf``` where you will then change ``` directories.tokendir``` to the location that you are using. If help needed, look at ```man softhsm2.conf```.

Once configured, run the following command:

```
softhsm2-util --init-token --slot 0 --label "ForFabric" --so-pin 1234 --pin 98765432
```
### Cloning Hyperledger Fabric

You must download Hyperledger Fabric by cloning the Github repository located at https://github.com/hyperledger/fabric. First you must fork the repository and then you can clone it to your computer.

```
mkdir -p <location for fabric>
cd <location for fabric>
git clone https://github.com/<github_userid>/fabric
```

### Installing Development Tools

You can use make to install some of the tools that will be used in the development of this. Tools will be installed within your ```$HOME/go/bin/``` directory. 

Use the following command:
```
make gotools
```

### Installing Binaries

Once you determine a location on your machine that you want to set this all up in, make use of the following command in order to download Docker images, Hyperledger Fabric binaries and Hyperledger Fabric Samples:

```
curl -sSL https://bit.ly/2ysb0FE | bash -s
```

If help is needed, you can use the command: ```curl -sSL https://bit.ly/2ysb0FE | bash -s -- -h```

The only parts that are needed are the Docker images and the binaries for Hyperledger Fabric. 

## Running the Blockchain Network and Usage
** WORK IN PROGRESS **

To start this application:

First, you will need to start the network and create channels within the network by using the following command after navigating within the ```test-network``` directory:

```
./network.sh up createChannel
```

Second, you will need to deploy the chaincode by using this command for our javascript smart contract (chain code). This chaincode can be written in many different languages but I just chose to use Javascript in this case.

```
./network.sh deployCC -ccn basic -ccp ../work-blockchain/chaincode-js -ccl javascript
```

Once the test network is brought up, you should be able to interact with the network by using ```peer``` CLI.

Make sure you are still within the ```test-network``` directory and if everything was done correctly, you should be able to find the ```bin``` directory within the ```fabric-samples``` repository. Add these binaries to your CLI Path by using the following command:

``` 

export PATH=${PWD}/../bin:$PATH

```

Also, make sure that the ```FABRIC_CFG_PATH``` is pointing to the ```core.yaml``` file.

After this, you can set the enviroment variables that allow you to operate the ```peer``` CLI as Org1:

```
# Environment variables for Org1

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

```

Once the environment variables are setup completely, run the command to initalize the ledger with the assets that are setup within the chaincode:

```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"InitLedger","Args":[]}'
```

Once the ledger is initialized, you should be able to query the ledger from the CLI by running the following command which is using the function as well within the chaincode:

```
peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAssets"]}'
```
** still a work in progress **

** PROBLEMS **

Having problems with the Docker configuration at the moment that is causing the code to not work properly.
