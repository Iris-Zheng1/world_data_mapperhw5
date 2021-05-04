import React, { useState, useEffect } 		                                from 'react';
import Logo 								                        from './navbar/Logo';
import { WNavbar, WNavItem, WButton } 		                        from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WRow, WCol }		                        from 'wt-frontend';
import {Link} 								                        from "react-router-dom";
import { useHistory }                                               from 'react-router-dom';
import { LOGOUT }                                                   from '../cache/mutations';
import { useMutation, useQuery, useApolloClient }                   from '@apollo/client';
import { GET_DB_MAPS } 				                                from '../cache/queries';
import WCard from 'wt-frontend/build/components/wcard/WCard';

const Regions = (props) => {
    let maps                                = [];
    let selectedMap                         = undefined;
	const history = useHistory();
    const client                            = useApolloClient();
	const [Logout]                          = useMutation(LOGOUT);
    const url                               = props.location.pathname.split('/');

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

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            history.push('/home');
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
                                    {props.user.firstName}
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
                    <div className="region-spreadsheet-header">Region Name: {selectedMap.name}</div>
                        <WRow className='table-entry'>
                            <WCol size='2'>Name</WCol>
                            <WCol size='2'>Capital</WCol>
                            <WCol size='2'>Leader</WCol>
                            <WCol size='1'>Flag</WCol>
                            <WCol size='2'>Landmarks</WCol>
                        </WRow>
                </div>
                { selectedMap.regions.map( entry =>
                             <WRow className='table-entry'>
                                <WCol size='2'>entry</WCol>
                            </WRow>)
                        }
                </>
                : <div/>}
            </WLMain>

		</WLayout> : <div className="welcome">loading...</div>
	);
};

export default Regions;
