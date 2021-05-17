const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		name: String!
		owner: String!
		regions: [Region]
		timestamp: Int!
	}
	type Region {
		_id: String!
		name: String!
		subregions: [String]
		capital: String!
		leader: String!
		landmarks: [String]
	}
	extend type Query {
		getMaps: [Map]
		getMapById(_id: String!): Map
	}
	extend type Mutation {
		addMap(map: MapInput!): String
		addRegion(region: RegionInput!, _id: String!, index: Int!): String
		deleteMap(_id: String!): Boolean
		deleteRegion(regionId: String!, _id: String!): [Region]
		sortRegions(_id: String!, field: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!): Boolean
		updateMapRegions(_id: String!, regions: [RegionInput!]): Boolean
		updateRegionField(regionId: String!, _id: String!, field: String!, value: String!): Boolean
		getSubregion(subregionId: String!): Region
	}
	input MapInput {
		_id: String
		name: String
		owner: String
		regions: [RegionInput]
		timestamp: Int
	}
	input RegionInput {
		_id: String
		name: String
		subregions: [String]
		capital: String
		leader: String
		landmarks: [String]
	}
`;

module.exports = { typeDefs: typeDefs }