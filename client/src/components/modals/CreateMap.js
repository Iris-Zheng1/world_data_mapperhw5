import React, { useState } 	from 'react';
//import { ADD_MAP } 			from '../../cache/mutations';
//import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WButton, WInput } from 'wt-frontend';
import WMFooter from 'wt-frontend/build/components/wmodal/WMFooter';

const CreateMap = (props) => {
    const [input, setInput] = useState({ name:'' });

    const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

    const handleCreate = async () => {
        for (let field in input) {
			if (!input[field]) {
				alert('Please name your map.');
				return;
			}
		}
        props.createNewMap(input.name);
        props.setShowCreate(false);
    }

    return (
        <WModal className="delete-modal" visible = {true}>
            <WMHeader className="modal-header" onClose={() => props.setShowDelete(false)}>
                Create A New Map
			</WMHeader>
            <WMMain>
                <WInput className="modal-input" onBlur={updateInput} name='name' labelAnimation="up" barAnimation="solid" labelText="Name" wType="outlined" inputType='text' />
            </WMMain>
            <WMFooter>
                <WButton className="modal-button" onClick={handleCreate} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
                    Create
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={() => props.setShowCreate(false)} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
                    Cancel
				</WButton>
            </WMFooter>
        </WModal>
    );
}

export default CreateMap;