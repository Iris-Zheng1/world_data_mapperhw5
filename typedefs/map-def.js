const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		name: String!
		owner: String!
		regions: [String!]
		timestamp: Int!
	}
	extend type Query {
		getMaps: [Map]
		getMapById(_id: String!): Map
	}
	extend type Mutation {
		addMap(map: MapInput!): String
		deleteMap(_id: String!): Boolean
	}
	input MapInput {
		_id: String
		name: String
		owner: String
		regions: [String]
		timestamp: Int
	}
`;

module.exports = { typeDefs: typeDefs }