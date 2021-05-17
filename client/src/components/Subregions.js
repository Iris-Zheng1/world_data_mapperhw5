import React, { useState, useEffect } 		                        from 'react';
import Logo 								                        from './navbar/Logo';
import { WNavbar, WNavItem, WButton } 		                        from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WRow, WCol }		            from 'wt-frontend';
import {Link} 								                        from "react-router-dom";
import { useHistory }                                               from 'react-router-dom';
import { LOGOUT }                                                   from '../cache/mutations';
import RegionEntry                                                  from '../components/regions/RegionEntry';
import { useMutation, useQuery, useApolloClient }                   from '@apollo/client';
import { GET_DB_MAPS } 				                                from '../cache/queries';
import * as mutations 					                            from '../cache/mutations';
import { UpdateRegions_Transaction, EditRegion_Transaction, 
         SortRegions_Transaction }                                  from '../utils/jsTPS';

const Subregions = (props) => {
    let maps                                = [];
    let selectedMap                         = undefined;
	const history = useHistory();
    const client                            = useApolloClient();
	const [Logout]                          = useMutation(LOGOUT);
    const url                               = props.location.pathname.split('/');

    const [AddRegion]                       = useMutation(mutations.ADD_REGION);
    const [DeleteRegion]                    = useMutation(mutations.DELETE_REGION);
    const [UpdateRegionField] 	            = useMutation(mutations.UPDATE_REGION_FIELD);
    const [SortRegions]                     = useMutation(mutations.SORT_REGIONS);
    const [UpdateMapRegions]                = useMutation(mutations.UPDATE_MAP_REGIONS);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);

    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) {
        maps = data.getMaps;
        selectedMap = maps.find( map => map._id === url[2]);
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

    const goHome = async (e) => {
        props.tps.clearAllTransactions();
        history.push('/maps');
    }

    const addRegion = async () => {
		let region = {
			_id: '',
			name: 'No Name',
			subregions: [],
            capital: 'No Capital',
            leader: 'No Leader',
            landmarks: []
		}
        let transaction = new UpdateRegions_Transaction(region._id, url[2], region, 1, AddRegion, DeleteRegion);
        props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const deleteRegion = async (region, index) => {
        let deletedRegion = {
			_id: region._id,
			name: region.name,
            subregions: region.subregions,
            capital: region.capital,
			leader: region.leader,
			landmarks: region.landmarks
		}
        let transaction = new UpdateRegions_Transaction(region._id, url[2], deletedRegion, 0, AddRegion, DeleteRegion, index);
        props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const updateRegionField = async (regionId, field, value, prev) => {
		if(value !== prev){
            let transaction = new EditRegion_Transaction(regionId, url[2], field, value, prev, UpdateRegionField);
            props.tps.addTransaction(transaction);
            tpsRedo();
        }
	};

    const sortRegions = async (field) => {
        let temp = [];
        for(let i = 0; i < selectedMap.regions.length; i++){
            let tempRegion = {
                _id: selectedMap.regions[i]._id,
                name: selectedMap.regions[i].name,
                subregions: selectedMap.regions[i].subregions,
                capital: selectedMap.regions[i].capital,
                leader: selectedMap.regions[i].leader,
                landmarks: selectedMap.regions[i].landmarks
            }
            temp.push(tempRegion);
        }
        let transaction = new SortRegions_Transaction(url[2], field, temp, SortRegions, UpdateMapRegions);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

	return (
		props.user ? <WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
                        <WNavItem onClick={goHome} className="home-nav">
                            <Logo className='logo' />
                        </WNavItem>
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
                            <WCol className="table-entry table-text" size='1'/>
                            <WCol className="table-entry table-text" size='2' onClick={() => {sortRegions('name')}}>Name</WCol>
                            <WCol className="table-entry table-text" size='2' onClick={() => {sortRegions('capital')}}>Capital</WCol>
                            <WCol className="table-entry table-text" size='2' onClick={() => {sortRegions('leader')}}>Leader</WCol>
                            <WCol className="table-entry table-text" size='1'>Flag</WCol>
                            <WCol className="table-entry table-text" size='4'>Landmarks</WCol>
                        </WRow>
                        { selectedMap.regions.map( (entry,index) =>
                            <RegionEntry entry={entry} index={index} deleteRegion={deleteRegion} editRegion={updateRegionField}/>)
                        }
                </div>
                </>
                : <div/>}
            </WLMain>

		</WLayout> : <div className="welcome">loading...</div>
	);
};

export default Subregions;
