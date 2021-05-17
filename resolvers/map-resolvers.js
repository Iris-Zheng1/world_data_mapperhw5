const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');
const Region = require('../models/region-model');

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
			return [];
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
		 	@param 	 {object} args - a map id and an empty region object
			@returns {string} the objectID of the region or an error message
		**/
		addRegion: async(_, args) => {
			const { _id, region, index } = args;
			const mapId = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Map.findOne({_id: mapId});
			if(!found) return ('Map not found');
			if(region._id === '') region._id = objectId;
			let mapRegions = found.regions;
			if(index < 0) mapRegions.push(region);
			else mapRegions.splice(index, 0, region);
			
			const newRegion = new Region({
				_id: region._id,
				name: region.name,
				capital: region.capital,
				leader: region.leader,
				landmarks: region.landmarks,
				owner: region.owner
			});

			const updated = await Map.updateOne({_id: mapId}, { regions: mapRegions});
			const updated1 = await newRegion.save();

			if(updated && updated1) return (region._id);
			else return ('Could not add region');
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
		 	@param 	 {object} args - a region objectID and map objectID
			@returns {array} the updated region array on success or the initial 
							 array on failure
		**/
		deleteRegion: async (_, args) => {
			const  { regionId, _id } = args;
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			let regions = found.regions;
			regions = regions.filter(region => region._id.toString() !== regionId);
			const updated = await Map.updateOne({_id: mapId}, { regions:regions });
			const deleted = await Region.deleteOne({_id: regionId});

			if(updated) return (regions);
			else return (found.regions);

		},
		/**
			@param 	 {object} args - contains list id, field to be sorted, a list of the previous list's item ids in order, and
			a flag indicating whether to sort or revert the list to the previous copy
			@returns true/false depending on whether the method was successful
		*/
		sortRegions: async (_,args) => {
			const {_id, field} = args;
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			let regions = found.regions;
			//create copy of the current list
			let copy = [];
			for(let i = 0; i < found.regions.length; i++){
				copy.push(found.regions[i][field]);
			}
			regions.sort(function(a,b){
				if (a[field] < b[field]) {
					return -1;
				  }
				  if (a[field] > b[field]) {
					return 1;
				  }
				  return 0;
			});
			for(let i = 0; i < regions.length; i++) {
				if(regions[i][field] !== copy[i]){
					const sorted = await Map.updateOne({_id: mapId}, { regions: regions });
					if(sorted) return true;
					return false;
				}
			}
			regions.reverse();
			for(let i = 0; i < regions.length; i++) {
				if(regions[i][field] !== copy[i][field]){
					const sorted = await Map.updateOne({_id: mapId}, { regions: regions });
					if(sorted) return true;
					return false;
				}
			}
			//the list cannot be sorted (i.e. all values are the same)
			return false;
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
		},
		/** 
		 	@param 	 {object} args - a map objectID and a list of regions
			@returns {boolean} true on successful update, false on failure
		**/
		updateMapRegions: async (_, args) => {
			const { _id, regions } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: objectId}, {regions: regions});
			if(updated) return true;
			else return false;
		},
		/** 
			@param	 {object} args - a map objectID, a region objectID, field, and
									 update value. 
			@returns {array} true on success, or false on failure
		**/
		updateRegionField: async (_, args) => {
			const { regionId, _id, field } = args;
			let { value } = args
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			let regions = found.regions;
			regions.map(region => {
				if(region._id.toString() === regionId) {	
					
					region[field] = value;
				}
			});
			const updated = await Map.updateOne({_id: mapId}, { regions: regions })
			const updated1 = await Region.updateOne({_id: regionId}, {[field]: value})
			if(updated) return true;
			return false;
		}
	}
}