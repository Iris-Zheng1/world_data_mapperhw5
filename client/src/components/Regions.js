import React, { useState, useEffect } 		                                from 'react';
import Logo 								                        from './navbar/Logo';
import { WNavbar, WNavItem, WButton } 		                        from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WRow, WCol }		                        from 'wt-frontend';
import {Link} 								                        from "react-router-dom";
import { useHistory }                                               from 'react-router-dom';
import { LOGOUT }                                                   from '../cache/mutations';
import RegionEntry                                                  from '../components/regions/RegionEntry';
import { useMutation, useQuery, useApolloClient }                   from '@apollo/client';
import { GET_DB_MAPS } 				                                from '../cache/queries';
import * as mutations 					                                    from '../cache/mutations';
import { EditRegion_Transaction } from '../utils/jsTPS';

const Regions = (props) => {
    let maps                                = [];
    let selectedMap                         = undefined;
	const history = useHistory();
    const client                            = useApolloClient();
	const [Logout]                          = useMutation(LOGOUT);
    const url                               = props.location.pathname.split('/');

    const [AddRegion]                       = useMutation(mutations.ADD_REGION);
    const [UpdateRegionField] 	            = useMutation(mutations.UPDATE_REGION_FIELD);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);

    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) {
        maps = data.getMaps;
        selectedMap = maps.find( map => map._id === url[2]);
        console.log(selectedMap.name)
    }

    const refetchMaps = async (refetch) => {
        const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getMaps;
		}
    }

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchMaps(refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchMaps(refetch);
		return retVal;
	}

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            history.push('/home');
        }
    };

    const addRegion = async() => {
		let region = {
			_id: '',
			name: 'No Name',
			subregions: [],
            capital: 'No Capital',
            leader: 'No Leader',
            landmarks: []
		}
		const { data } = await AddRegion({ variables: { region: region, _id:url[2] }, refetchQueries: [{ query: GET_DB_MAPS }] });
		await refetchMaps(refetch);
    }

    const updateListField = async (regionId, field, value, prev) => {
		if(value !== prev){
            let transaction = new EditRegion_Transaction(regionId, url[2], field, value, prev, UpdateRegionField);
            props.tps.addTransaction(transaction);
            tpsRedo();
        }
	};

	return (
		props.user ? <WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
                        <Link to='/maps'>
                            <WNavItem>
                                <Logo className='logo' />
                            </WNavItem>
                        </Link>
					</ul>
					<ul>
					    <Link to="/update-account">
                            <WNavItem hoverAnimation="lighten">
                                <WButton className="navbar-options-accent" wType="texted">
                                    {props.user.firstName + " " + props.user.lastName}
                                </WButton>
                            </WNavItem>
                        </Link>
                        <WNavItem hoverAnimation="lighten">
                            <WButton className="navbar-options" onClick={handleLogout} wType="texted"> 
                                Logout
                            </WButton>
                        </WNavItem>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLMain>
                {selectedMap ? 
                <>
                <div className="region-spreadsheet">
                    <div className="region-spreadsheet-header">
                        <WButton className="header-button" onClick={addRegion} size="small" span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded"><i className="material-icons">add</i></WButton>
                        <WButton className="header-button"  size="small" disabled={!props.tps.hasTransactionToUndo()} onClick={tpsUndo} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded"><i className="material-icons">undo</i></WButton>
                        <WButton className="header-button"  size="small" disabled={!props.tps.hasTransactionToRedo()} onClick={tpsRedo}span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded"><i className="material-icons">redo</i></WButton>
                        <div className="region-spreadsheet-title">Region Name: {selectedMap.name}</div>
                    </div>
                        <WRow >
                            <WCol className="table-entry table-text" size='3'>Name</WCol>
                            <WCol className="table-entry table-text" size='2'>Capital</WCol>
                            <WCol className="table-entry table-text" size='2'>Leader</WCol>
                            <WCol className="table-entry table-text" size='1'>Flag</WCol>
                            <WCol className="table-entry table-text" size='4'>Landmarks</WCol>
                        </WRow>
                        { selectedMap.regions.map( entry =>
                            <RegionEntry entry={entry} editRegion={updateListField}/>)
                        }
                </div>
                </>
                : <div/>}
            </WLMain>

		</WLayout> : <div className="welcome">loading...</div>
	);
};

export default Regions;
