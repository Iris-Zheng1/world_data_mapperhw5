import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			firstName
			lastName
			password
			initials
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
		register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
			email
			password
			firstName
			lastName
		}
	}
`;
export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const UPDATE = gql`
	mutation Update($_id: String!, $email:String!, $oldPassword:String!, $newPassword: String!, $firstName: String!, $lastName: String!) {
		update(_id: $_id, email: $email, oldPassword: $oldPassword, newPassword: $newPassword, firstName: $firstName, lastName: $lastName)
	}
`;

//MAPS

export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!) {
		addMap(map: $map) 
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const UPDATE_MAP_FIELD = gql`
	mutation UpdateMapField($_id: String!, $field: String!, $value: String!) {
		updateMapField(_id: $_id, field: $field, value: $value)
	}
`;

export const ADD_REGION = gql`
	mutation AddRegion($region: RegionInput!, $_id: String!, $index: Int!) {
		addRegion(region: $region, _id: $_id, index: $index)
   }
`;

export const UPDATE_REGION_FIELD = gql`
	mutation UpdateRegionField($regionId: String!, $_id: String!, $field: String!, $value: String!){
		updateRegionField(regionId: $regionId, _id: $_id, field: $field, value: $value)
	}
`;

export const DELETE_REGION = gql`
	mutation DeleteRegion($regionId: String!, $_id: String!){
		deleteRegion(regionId: $regionId, _id: $_id){
			_id
			name
			subregions
			capital
			leader
			landmarks
		}
	}
`;

export const SORT_REGIONS = gql`
	mutation SortRegions($_id: String!, $field: String!){
		sortRegions(_id: $_id, field: $field)
	}
`;

export const UPDATE_MAP_REGIONS = gql`
	mutation UpdateMapRegions($_id: String!, $regions: [RegionInput!]){
		updateMapRegions(_id: $_id, regions: $regions)
	}
`;