const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of map objects on success, and an empty array on failure
		**/
		getMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) return (maps.sort(function(x,y){
				return y.timestamp-x.timestamp;
			}));
		},
		/** 
		 	@param 	 {object} args - a map id
			@returns {object} a map on success and an empty object on failure
		**/
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(map) return map;
			else return ({});
		},
	},
	Mutation: {
		/** 
		 	@param 	 {object} args - a map id and an empty region object
			@returns {string} the objectID of the region or an error message
		**/
		addRegion: async(_, args) => {
			const { _id, region } = args;
			const mapId = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Map.findOne({_id: mapId});
			if(!found) return ('Map not found');
			if(region._id === '') region._id = objectId;
			let mapRegions = found.regions;
			mapRegions.push(region);
			
			const updated = await Map.updateOne({_id: mapId}, { regions: mapRegions});

			if(updated) return (objectId);
			else return ('Could not add region');
		},
		/** 
		 	@param 	 {object} args - an empty map object
			@returns {string} the objectID of the map or an error message
		**/
		addMap: async (_, args) => {
			const { map } = args;
			const objectId = new ObjectId();
			const { name, owner, regions, timestamp } = map;
			const newMap = new Map({
				_id: objectId,
				name: name,
				owner: owner,
				regions: regions,
				timestamp: timestamp
			});
			const updated = await newMap.save();
			if(updated) return objectId;
			else return ('Could not add map');
		},
		/** 
		 	@param 	 {object} args - a map objectID 
			@returns {boolean} true on successful delete, false on failure
		**/
		deleteMap: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
		},
		/** 
		 	@param 	 {object} args - a map objectID, field, and the update value
			@returns {boolean} true on successful update, false on failure
		**/
		updateMapField: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			if(field==="timestamp"){
				const updated = await Map.updateOne({_id: objectId}, {[field]: parseInt(value)});
				if(updated) return true;
				else return false;
			}
			const updated = await Map.updateOne({_id: objectId}, {[field]: value});
			if(updated) return true;
			else return false;
		}
	}
}