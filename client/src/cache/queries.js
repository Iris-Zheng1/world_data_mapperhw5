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

export const GET_DB_MAP = gql`
	query GetDBMap {
		getMap {
			_id
			name
			owner
			regions
			timestamp
		}
}
`;