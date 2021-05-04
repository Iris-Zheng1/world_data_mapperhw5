import React, { useState } 	from 'react';
import { WModal, WMHeader, WMMain, WButton, WInput } from 'wt-frontend';
import WMFooter from 'wt-frontend/build/components/wmodal/WMFooter';

const CreateMap = (props) => {
    const [input, setInput] = useState({ name:'' });

    const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

    const handleEdit = async () => {
        for (let field in input) {
			if (!input[field]) {
				alert('Please name your map.');
				return;
			}
		}
        props.setShowEdit(false);
        props.editMapName(props.id,input.name);
    }

    return (
        <WModal className="delete-modal" visible = {true}>
            <WMHeader className="modal-header" onClose={() => props.setShowEdit(false)}>
                Rename Map
			</WMHeader>
            <WMMain>
                <WInput className="modal-input" onBlur={updateInput} name='name' labelAnimation="up" barAnimation="solid" labelText="Name" wType="outlined" inputType='text' defaultValue={props.name}/>
            </WMMain>
            <WMFooter>
                <WButton className="modal-button" onClick={handleEdit} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
                    Change
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={() => props.setShowEdit(false)} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
                    Cancel
				</WButton>
            </WMFooter>
        </WModal>
    );
}

export default CreateMap;