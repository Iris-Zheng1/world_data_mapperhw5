import React, { useState, useEffect } 		                                from 'react';
import Logo 							                                    from './navbar/Logo';
import DeleteButton                                                         from './mapbuttons/DeleteButton'
import EditMapButton                                                        from './mapbuttons/EditMapButton'
import { LOGOUT }                                                           from '../cache/mutations';
import { useMutation, useQuery, useApolloClient }                           from '@apollo/client';
import { WNavbar, WSidebar, WNavItem,WButton } 	                            from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide }                                from 'wt-frontend';
import {Link} 						                                        from "react-router-dom";
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
import Regions                                                              from '../components/Regions'
import Homescreen                                                           from '../components/Homescreen'


const MapSelection = (props) => {
    let maps                                = [];
    const client                            = useApolloClient();
	const [Logout]                          = useMutation(LOGOUT);
    const [showCreate, toggleShowCreate] 	= useState(false);

    const [AddMap] 			                = useMutation(mutations.ADD_MAP);
    const [DeleteMap] 			            = useMutation(mutations.DELETE_MAP);
    const [UpdateMapField]                  = useMutation(mutations.UPDATE_MAP_FIELD);
    const history = useHistory();
    
    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);

    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) {
        maps = data.getMaps;
    }

    const handleLogout = async (e) => {
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

    const setShowCreate = () => {
		toggleShowCreate(!showCreate);
	}

    const createNewMap = async (name) => {
		let len =  Math.log(Date.now()) * Math.LOG10E + 1 | 0;
		let timestamp = Date.now() % Math.pow(10,len-(len-9));
		let map = {
			_id: '',
			name: name,
			owner: props.user._id,
			regions: [],
			timestamp: timestamp
		}
		const { data } = await AddMap({ variables: { map: map }, refetchQueries: [{ query: GET_DB_MAPS }] });
		await refetchMaps(refetch);
	};

    const deleteMap = async (id) => {
        DeleteMap({ variables: { _id: id }, refetchQueries: [{ query: GET_DB_MAPS }] });
		await refetchMaps(refetch);
    };

    const editMapName = async (id, name) => {
        UpdateMapField({variables: {_id: id, field: "name", value:name},refetchQueries: [{ query: GET_DB_MAPS }] });
        await refetchMaps(refetch);
    }

    const openMap = async (id) => {
        let len =  Math.log(Date.now()) * Math.LOG10E + 1 | 0;
		let timestamp = Date.now() % Math.pow(10,len-(len-9));
        UpdateMapField({variables: {_id: id, field: "timestamp", value:''+timestamp},refetchQueries: [{ query: GET_DB_MAPS }] });
        await refetchMaps(refetch);
        history.push("/maps/"+id);
    }

    return (
        <>
		<WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
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
                <WCard wLayout='header-content-media' className="map-select" height="1000px">
                    <WCHeader className="map-select-header">Your Maps</WCHeader>
                    <WCContent className="map-select-maps">
                        {maps.map( map => (
                            <WNavItem>
                                <WButton className='map-text' onClick={() => {openMap(map._id)}}>{map.name}</WButton>
                                <DeleteButton id={map._id} deleteMap={deleteMap}/>
                                <EditMapButton id={map._id} name={map.name} editMapName={editMapName}/>
                            </WNavItem>
                        ))}
                    </WCContent>
                    <WCMedia>
                        <img src={globe} alt="globe.jpg" className='map-select-media'/><br></br>
                        <WButton className="create-map" onClick={setShowCreate} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">Create Map</WButton>
                    </WCMedia>
                </WCard>
            </WLMain>
            {showCreate && <CreateMap setShowCreate={setShowCreate} createNewMap={createNewMap}/>}
		</WLayout>
        </>
	);
};

const Maps = (props) => {
    const history = useHistory();

    return(
        props.user ? <MapSelection fetchUser={props.fetchUser} user={props.user}/> : <>{history.push("/home")}<Homescreen fetchUser={props.fetchUser} user={props.user}/></>
    );
}

export default Maps;