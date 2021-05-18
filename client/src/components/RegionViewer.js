import React, { useState, useEffect } 		                                from 'react';
import Logo 							                                    from './navbar/Logo';
import DeleteButton                                                         from './mapbuttons/DeleteButton'
import EditMapButton                                                        from './mapbuttons/EditMapButton'
import { LOGOUT }                                                           from '../cache/mutations';
import { useMutation, useQuery, useApolloClient }                           from '@apollo/client';
import { WNavbar, WSidebar, WNavItem,WButton } 	                            from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide }                                from 'wt-frontend';
import {Link} 						                                        from "react-router-dom";
import { WRow, WCol }		                                                from 'wt-frontend';
import WCard                                                                from 'wt-frontend/build/components/wcard/WCard';
import WCHeader                                                             from 'wt-frontend/build/components/wcard/WCHeader';
import WCContent                                                            from 'wt-frontend/build/components/wcard/WCContent';
import WCMedia                                                              from 'wt-frontend/build/components/wcard/WCMedia';
import globe								                                from '../images/globe.jpeg';
import CreateMap 					                                        from '../components/modals/CreateMap';
import { GET_DB_MAPS } 				                                        from '../cache/queries';
import * as mutations 					                                    from '../cache/mutations';
import { Switch, Route }                                                    from 'react-router-dom';
import { useHistory }                                                       from 'react-router-dom';
import LandmarkEntry                                                  from '../components/landmarks/LandmarkEntry';
import LandmarkParent                                                  from '../components/landmarks/LandmarkParent';
import WInput from 'wt-frontend/build/components/winput/WInput';
import { UpdateLandmarks_Transaction}                                  from '../utils/jsTPS';

const RegionViewer = (props) => {
    let maps                                = [];
    let selectedMap                         = undefined;
    let selectedRegion                      = undefined;

    const client                            = useApolloClient();
	const [Logout]                          = useMutation(LOGOUT);
    const url                               = props.location.pathname.split('/');
    const history = useHistory();
    
    const [UpdateMapRegions]                = useMutation(mutations.UPDATE_MAP_REGIONS);
    const [UpdateRegionField] 	            = useMutation(mutations.UPDATE_REGION_FIELD);
    const [ChangeParent]                    = useMutation(mutations.CHANGE_REGION_PARENT);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);

    const [input, setInput] = useState({ name: '' });

    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) {
        maps = data.getMaps;
        selectedMap = maps.find( map => map._id === url[2]);
        selectedRegion = selectedMap.regions.find( region => region._id === url[3]);
    }

    const goHome = async (e) => {
        props.tps.clearAllTransactions();
        history.push('/maps');
    }

    const goBack = async (e) => {
        props.tps.clearAllTransactions();
        history.push('/maps/'+url[2]);
    }

    const goNext = async (bool) => {
        props.tps.clearAllTransactions();
        let link = '/region-view/'+url[2]+'/';
        for(let i = 0; i < selectedMap.regions.length; i++){
            if(bool && i > 0 && selectedMap.regions[i-1]._id === selectedRegion._id){
                link += selectedMap.regions[i]._id;
            }
            if(!bool && i < selectedMap.regions.length-1 && selectedMap.regions[i+1]._id === selectedRegion._id){
                link += selectedMap.regions[i]._id;
            }
        }
        history.push(link);
    }

    const handleLogout = async (e) => {
        props.tps.clearAllTransactions();
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            history.push('/home');
        }
    };

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

    const updateInput = (e) => {
		const { value } = e.target;
		const updated = { ...input, name: value };
		setInput(updated);
	}

    const updateLandmark = async (index, newVal) => {
        let landmarks = '';
        let newLandmarks = '';
        for(let i = 0; i < selectedRegion.landmarks.length; i++){
            if(i !== index){
                newLandmarks += selectedRegion.landmarks[i] + "?";
            }
            else{
                newLandmarks += newVal + "?"
            }
            landmarks += selectedRegion.landmarks[i] + "?";
        }
        let transaction = new UpdateLandmarks_Transaction(selectedRegion._id, selectedMap._id, landmarks, newLandmarks, UpdateRegionField);
        props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const deleteLandmark = async (index) => {
        let landmarks = '';
        let newLandmarks = '';
        for(let i = 0; i < selectedRegion.landmarks.length; i++){
            if(i !== index){
                newLandmarks += selectedRegion.landmarks[i] + "?";
            }
            landmarks += selectedRegion.landmarks[i] + "?";
        }
        let transaction = new UpdateLandmarks_Transaction(selectedRegion._id, selectedMap._id, landmarks, newLandmarks, UpdateRegionField);
        props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const addLandmark = async () => {
        if(input.name === ''){
            alert('Please name the new landmark');
            return;
        }
        if(input.name.indexOf('?') !== -1 ){
            alert('Landmark name uses invalid characters');
            return;
        }
        if(selectedRegion.landmarks.indexOf(input.name) !== -1){
            alert('Landmark already exists in this region');
            return;
        }
        let landmarks = '';
        for(let i = 0; i < selectedRegion.landmarks.length; i++){
            landmarks += selectedRegion.landmarks[i] + "?"
        }
        let newLandmarks = '' + landmarks + input.name;
        let transaction = new UpdateLandmarks_Transaction(selectedRegion._id, selectedMap._id, landmarks, newLandmarks, UpdateRegionField);
        props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const changeParent = async (regionId, prevId, newId) => {
        props.tps.clearAllTransactions();
        await ChangeParent({variables: {regionId: regionId, prevId: prevId, newId:newId}});
        history.push('/region-view/'+newId+'/'+regionId);
    };

    return (
        props.user && selectedMap && selectedRegion ? <>
		<WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem className="home-button" onClick={goHome}>
                            <Logo className='logo' />
                        </WNavItem>
                        <WNavItem className="home-button" onClick={goBack}>
                            <WButton className="navbar-options ancestor-region" wType="texted">
                                {selectedMap.name}
                            </WButton>
                        </WNavItem>
					</ul>
                    <ul>
                        <WRow>
                        <WCol size='6'>
                        { selectedMap.regions.indexOf(selectedRegion) !== 0 ? 
                        <WNavItem className="home-button" onClick={() => goNext(false)}>
                            <WButton className="navbar-options" wType="texted">
                                <i className="material-icons">arrow_back</i>
                            </WButton>
                        </WNavItem> : <div/>
                        }
                        </WCol>
                        <WCol size='6'>
                        { selectedMap.regions.indexOf(selectedRegion) !== selectedMap.regions.length-1 ? 
                        <WNavItem className="home-button" onClick={() => goNext(true)}>
                            <WButton className="navbar-options" wType="texted">
                                <i className="material-icons">arrow_forward</i>
                            </WButton>
                        </WNavItem> : <div/>
                        }
                        </WCol>
                        </WRow>
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
                <div className="region-info">
                    <WButton className="header-button" onClick={tpsUndo} size="small" disabled={!props.tps.hasTransactionToUndo()} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded"><i className="material-icons">undo</i></WButton>
                    <WButton className="header-button" onClick={tpsRedo} size="small" disabled={!props.tps.hasTransactionToRedo()} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded"><i className="material-icons">redo</i></WButton>
                    <br></br><br></br>
                    <img className="region-picture" src='https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?cs=srgb&dl=pexels-pixabay-87651.jpg&fm=jpg' alt="picture"></img>
                    <div>Region Name: {selectedRegion.name}</div><br></br>
                    <LandmarkParent maps={maps} selectedMap={selectedMap} selectedRegion={selectedRegion} changeParent={changeParent}/>
                    <br></br>
                    <div>Region Capital: {selectedRegion.capital}</div><br></br>
                    <div>Region Leader: {selectedRegion.leader}</div><br></br>
                    <div># of Sub Regions: {selectedRegion.subregions.length}</div>
                </div>
                <div className="region-landmarks">
                    <WCard className="region-landmarks-list">
                        { selectedRegion.landmarks.map( (entry, index) =>
                            <LandmarkEntry entry={entry} index={index} editLandmark={updateLandmark} deleteLandmark={deleteLandmark}/>)
                        }
                    </WCard>
                    <WCard className='add-landmark'>
                        <WRow>
                            <WCol size="1"><WButton className='add-landmark-button' onClick={addLandmark} size="small" span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded"><i className="material-icons">add</i></WButton></WCol>
                            <WCol size="8">
                                <WInput className="landmark-input" onBlur={updateInput} span={false} name='name' inputType='text' />
                            </WCol>
                        </WRow>
                    </WCard>
                </div>
            </WLMain>
            
		</WLayout>
        </>: <div/>
	);
};

export default RegionViewer;