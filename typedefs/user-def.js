const { gql } = require('apollo-server');

const typeDefs = gql `
	type User {
		_id: String
		firstName: String
		lastName: String
		initials: String
		email: String
		password: String
	}
	extend type Query {
		getCurrentUser: User
		testQuery: String
	}
	extend type Mutation {
		login(email: String!, password: String!): User
		register(email: String!, password: String!, firstName: String!, lastName: String!): User
		logout: Boolean!
		update(_id: String!, email: String!, oldPassword: String!, newPassword: String!, firstName: String!, lastName: String!): Boolean
	}
`;

module.exports = { typeDefs: typeDefs }