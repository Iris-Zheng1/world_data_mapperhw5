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
		addRegion(region: RegionInput!, _id: String!): String
		addMap(map: MapInput!): String
		deleteMap(_id: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!): Boolean
		updateRegionField(regionId: String!, _id: String!, field: String!, value: String!): Boolean
	}
	input MapInput {
		_id: String
		name: String
		owner: String
		regions: [String]
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