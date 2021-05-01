import React, { useState } 	from 'react';
import { UPDATE }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const UpdateAccount = (props) => {
	const [input, setInput] = useState({ email: ''+props.user.email, oldPassword: '', newPassword: '', firstName: ''+props.user.firstName, lastName: ''+props.user.lastName });
	const [loading, toggleLoading] = useState(false);
	const [Update] = useMutation(UPDATE);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Current password incorrect.";

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
			toggleLoading(false)
			props.setShowUpdate(false)
		}
    }

    return (
		<div className="update-modal">

			{
				loading ? <div />:
        <WModal className="update-modal" visible = {true}>
            <WMHeader className="modal-header" onClose={() => props.setShowUpdate(false)}>
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
					barAnimation="solid" labelText="Current Password" wType="outlined" inputType="text" 
				/>
				<div className="modal-spacer">&nbsp;</div>
				<WInput 
					className="modal-input" onBlur={updateInput} name="newPassword" labelAnimation="up" 
					barAnimation="solid" labelText="New Password" wType="outlined" inputType="text" 
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
				<WButton className="modal-button-right" onClick={() => props.setShowUpdate(false)} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" >
					Cancel
				</WButton>
            </WMFooter>

        </WModal>}
		</div>
    );
}

export default UpdateAccount;
