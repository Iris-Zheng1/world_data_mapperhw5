import React, { useState } 	from 'react';
import { UPDATE }			from '../cache/mutations';
import { useMutation }    	from '@apollo/client';
import Logo 							                     from './navbar/Logo';
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';
import { WNavbar, WNavItem } 	                                            from 'wt-frontend';
import { WLayout, WLHeader }                                	from 'wt-frontend';
import { useHistory }                                                       from 'react-router-dom';

const UpdateAccountModal = (props) => {
	const [input, setInput] = useState({ email: ''+props.user.email, oldPassword: '', newPassword: '', firstName: ''+props.user.firstName, lastName: ''+props.user.lastName });
	const [loading, toggleLoading] = useState(false);
	const [Update] = useMutation(UPDATE);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Current password incorrect.";
	const history = useHistory();

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

    const handleUpdateAccount = async (e) => {
		for (let field in input) {
			console.log(input[field]);
			if (!input[field]) {
				alert('All fields must be filled out to update');
				return;
			}
		}
		const userId = ''+props.user._id;
		const { loading, error, data } = await Update({ variables: { _id: userId,...input } });
		if (!(data.update)) {
			displayErrorMsg(true);
			return;
		}
		else{
			props.fetchUser();
			toggleLoading(false);
			history.push("/maps");
		}
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
						<WNavItem>
							<WButton className="navbar-options-accent-disabled" wType="texted">
								{props.user.firstName}
							</WButton>
						</WNavItem>
						<WNavItem>
							<WButton className="navbar-options-disabled" wType="texted">
								Logout
							</WButton>
						</WNavItem>
					</ul>
				</WNavbar>
			</WLHeader>
        <WModal className="update-modal" visible = {true}>
            <WMHeader className="modal-header" onClose={() => {history.push("/maps")}}>
                Update Account Information
			</WMHeader>
			<WMMain>
				<WRow className="modal-col-gap signup-modal">
					<WCol size="6">
						<WInput 
							className="" onBlur={updateInput} name="firstName" labelAnimation="up" 
							barAnimation="solid" labelText="First Name" wType="outlined" inputType="text" 
							defaultValue={props.user.firstName}
						/>
					</WCol>
					<WCol size="6">
						<WInput 
							className="" onBlur={updateInput} name="lastName" labelAnimation="up" 
							barAnimation="solid" labelText="Last Name" wType="outlined" inputType="text" 
							defaultValue={props.user.lastName}
						/>
					</WCol>
				</WRow>

				<div className="modal-spacer">&nbsp;</div>
				<WInput 
					className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
					barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text" 
					defaultValue={props.user.email}
				/>
				<div className="modal-spacer">&nbsp;</div>
				<WInput 
					className="modal-input" onBlur={updateInput} name="oldPassword" labelAnimation="up" 
					barAnimation="solid" labelText="Current Password" wType="outlined" inputType="password" 
				/>
				<div className="modal-spacer">&nbsp;</div>
				<WInput 
					className="modal-input" onBlur={updateInput} name="newPassword" labelAnimation="up" 
					barAnimation="solid" labelText="New Password" wType="outlined" inputType="password" 
				/>
				{
								showErr ? <div className='modal-error'>
									{errorMsg}
								</div>
									: <div className='modal-error'>&nbsp;</div>
							}
			</WMMain>
            <WMFooter>
				<WButton className="modal-button" onClick={handleUpdateAccount} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" >
					Update
				</WButton>
				<WButton className="modal-button-right" onClick={() => {history.push("/maps")}} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" >
					Cancel
				</WButton>
            </WMFooter>

        </WModal>
		</WLayout>
    );
}

const UpdateAccount = (props) => {
	return(
		props.user ? <UpdateAccountModal fetchUser={props.fetchUser} user={props.user}/>:<div className="loading">LOADING...</div>
	);
}

export default UpdateAccount;
