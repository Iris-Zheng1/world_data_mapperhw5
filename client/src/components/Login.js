import React, { useState, useEffect }                                      	from 'react';
import Logo 							                                    from './navbar/Logo';
import { LOGIN } 			                                                from '../cache/mutations';
import { useMutation }                                                     	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput }              from 'wt-frontend';
import { WNavbar, WNavItem } 	                                            from 'wt-frontend';
import { WLayout, WLHeader }                                				from 'wt-frontend';
import { useHistory }                                                       from 'react-router-dom';

const Login = (props) => {
    const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);
    const history = useHistory();

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

	const handleLogin = async (e) => {

		const { loading, error, data } = await Login({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			props.fetchUser();
			toggleLoading(false);
			history.push("/maps");
		};
	};

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
					<WNavItem>
						<WButton className="navbar-options-disabled" wType="texted">
                            Create Account
						</WButton>
					</WNavItem>
					<WNavItem>
						<WButton className="navbar-options-accent-disabled" wType="texted">
                            Login
						</WButton>
					</WNavItem>
					</ul>
				</WNavbar>
			</WLHeader>
            <WModal visible = {true} className="main-login-modal">
						<WMHeader className="modal-header" onClose={() => {history.push("/home")}}>
							Login To Your Account
						</WMHeader>
						<WMMain>
							<WInput className="modal-input" onBlur={updateInput} name='email' labelAnimation="up" barAnimation="solid" labelText="Email Address" wType="outlined" inputType='text' />
							<div className="modal-spacer">&nbsp;</div>
							<WInput className="modal-input" onBlur={updateInput} name='password' labelAnimation="up" barAnimation="solid" labelText="Password" wType="outlined" inputType='password' />

							{
								showErr ? <div className='modal-error'>
									{errorMsg}
								</div>
									: <div className='modal-error'>&nbsp;</div>
							}
						</WMMain>
						<WMFooter>
							<WButton className="modal-button" onClick={handleLogin} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
								Login
							</WButton>
							<WButton className="modal-button-right" onClick={() => {history.push("/home")}} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" >
								Cancel
							</WButton>
						</WMFooter>
					</WModal>

		</WLayout>
	);
};

export default Login;