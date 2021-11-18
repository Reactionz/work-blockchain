/* 
We need a basic CRUD like operation set up for our blockchain.
*/

'use strict'

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class TestContract extends Contract {

	async InitLedger(ctx) {
		const assets = [
			{
                ID: 'asset1',
                Color: 'blue',
                Size: 5,
                Owner: 'Tomoko',
                AppraisedValue: 300,
            },
            {
                ID: 'asset2',
                Color: 'red',
                Size: 5,
                Owner: 'Brad',
                AppraisedValue: 400,
            },
            {
                ID: 'asset3',
                Color: 'green',
                Size: 10,
                Owner: 'Jin Soo',
                AppraisedValue: 500,
            },
            {
                ID: 'asset4',
                Color: 'yellow',
                Size: 10,
                Owner: 'Max',
                AppraisedValue: 600,
            },
            {
                ID: 'asset5',
                Color: 'black',
                Size: 15,
                Owner: 'Adriana',
                AppraisedValue: 700,
            },
            {
                ID: 'asset6',
                Color: 'white',
                Size: 15,
                Owner: 'Michel',
                AppraisedValue: 800,
            },
		];

        for (const asset of assets) {
            asset.docType = 'asset';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
        }
	}
	

	// CREATE 
	async createAsset(ctx, id, color, size, owner, appraisedValue) {
		// Check out if the asset in the ledger already exists.
		const exists = await this.AssetExists(ctx, id);

		if (exists) {
			throw new Error(`This asset ${id} already exists!`);
		}

		const newAsset = {
			ID: id,
			Color: color,
			Size: size, 
			Owner: owner,
			AppraisedValue: appraisedValue
		}

		// we insert data and wait to see if it actualy gets put in the ledger
		await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))))
		return JSON.stringify(newAsset);
	}

	// READ
	async readAsset(ctx, id) {
		// search for asset in the ledger
		const assetJSON = await ctx.stub.getAsset(id);

		// if it doesn't exist, then throw an error.
		if (!assetJSON || assetJSON.length == 0) {
			throw new Error(`The asset ${id} does not exist.`);
		}

		// return the json in a string
		return assetJSON.toString();
	}
	
	// UPDATE
	async updateAsset(ctx, id, color, size, owner, appraisedValue) {
		const exists = await this.AssetExists(ctx, id);

		// if the asset doesn't exist, then throw an error
		if (!exists) {
			throw new Error(`This asset ${id} already exists!`);
		}

		const updatedAsset = {
			ID: id, 
			Color: color,
			Size: size,
			Owner: owner,
			AppraisedValue: appraisedValue
		}

		await ctx.stub.putstate(ctx, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
		return JSON.stringify(updatedAsset);
	}

	// DELETE (shouldn't need a delete but let's use it just incase).
	
	// DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

	// Helper Functions
	    
	// AssetExists returns true if something is found with actual values
	async AssetExists(ctx, id) {
		// search for the asset in the ledger
		const assetJSON = await ctx.stub.getState(id);
		// if it exists and has some length
		return assetJSON && assetJSON.length > 0;
	}


    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.Owner = newOwner;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
	
}

module.exports = TestContract;