import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			firstName
			lastName
			email
		}
	}
`;

export const GET_DB_TODOS = gql`
	query GetDBTodos {
		getAllTodos {
			_id
			id
			name
			owner
			items {
				_id
				id
				description
				due_date
				assigned_to
				completed
			}
		}
	}
`;

export const GET_DB_MAPS = gql`
	query GetDBMaps {
		getMaps {
			_id
			name
			owner
			regions
			timestamp
		}
	}
`;
