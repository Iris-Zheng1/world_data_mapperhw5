import React 								from 'react';
import Logo 								from './navbar/Logo';
import { WNavbar, WNavItem, WButton } 		from 'wt-frontend';
import { WLayout, WLHeader, WLMain }		from 'wt-frontend';
import globe								from '../images/globe.jpeg';
import {Link} 								from "react-router-dom";
import { useHistory }                                                       from 'react-router-dom';

const Homescreen = (props) => {
	const history = useHistory();
	if(props.user){
		history.push("/maps");
	}
	
	return (
		<WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
					<Link to="/signup"><WNavItem hoverAnimation="lighten">
						<WButton className="navbar-options" onClick={props.setShowCreate} wType="texted">
							Create Account
						</WButton>
					</WNavItem></Link>
					<Link to="/login"><WNavItem hoverAnimation="lighten">
						<WButton className="navbar-options-accent" onClick={props.setShowLogin} wType="texted"> 
							Login
						</WButton>
					</WNavItem>
					</Link>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLMain className="welcome"><img src={globe} alt="globe.jpg"/><br/>Welcome To The World Data Mapper</WLMain>

		</WLayout>
	);
};

export default Homescreen;
