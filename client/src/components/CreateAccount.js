import React, { useState } 													from 'react';
import { REGISTER }															from '../cache/mutations';
import { useMutation }    													from '@apollo/client';
import Logo 							                                    from './navbar/Logo';
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput }              from 'wt-frontend';
import { WNavbar, WNavItem } 	                                            from 'wt-frontend';
import { WLayout, WLHeader, WRow, WCol }                                	from 'wt-frontend';
import { useHistory }                                                       from 'react-router-dom';

const CreateAccount = (props) => {
	
	const [input, setInput] = useState({ email: '', password: '', firstName: '', lastName: '' });
	const [loading, toggleLoading] = useState(false);
	const [Register] = useMutation(REGISTER);
	const history = useHistory();
	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};
	
	const handleCreateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
		}
		const { loading, error, data } = await Register({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.register.email === 'already exists') {
				alert('User with that email already registered');
			}
			else {
				props.fetchUser();
				history.push("/home")
			}
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
			<WModal visible = {true} className = "signup-modal" >
				<WMHeader className="modal-header" onClose={() => {history.push("/home")}}>
					Create A New Account
				</WMHeader>
				<WMMain>
					<WRow className="modal-col-gap signup-modal">
						<WCol size="6">
							<WInput 
								className="" onBlur={updateInput} name="firstName" labelAnimation="up" 
								barAnimation="solid" labelText="First Name" wType="outlined" inputType="text" 
							/>
						</WCol>
						<WCol size="6">
							<WInput 
								className="" onBlur={updateInput} name="lastName" labelAnimation="up" 
								barAnimation="solid" labelText="Last Name" wType="outlined" inputType="text" 
							/>
						</WCol>
					</WRow>

					<div className="modal-spacer">&nbsp;</div>
					<WInput 
						className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
						barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text" 
					/>
					<div className="modal-spacer">&nbsp;</div>
					<WInput 
						className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
						barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
					/>
				</WMMain>
				<WMFooter>
					<WButton className="modal-button" onClick={handleCreateAccount} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" >
						Create Account
					</WButton>
					<WButton className="modal-button-right" onClick={() => {history.push("/home")}} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" >
						Cancel
					</WButton>
				</WMFooter>
			</WModal>
		</WLayout>
			
	);
}

export default CreateAccount;
