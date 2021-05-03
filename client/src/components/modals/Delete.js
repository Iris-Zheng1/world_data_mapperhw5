import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';
import WMFooter from 'wt-frontend/build/components/wmodal/WMFooter';

const Delete = (props) => {
    const handleDelete = async () => {
        props.deleteMap(props.id);
        props.setShowDelete(false);
    }

    return (
        <WModal className="delete-modal" visible = {true}>
            <WMHeader className="modal-header" onClose={() => props.setShowDelete(false)}>
                Delete Map?
			</WMHeader>

            <WMFooter>
            <WButton className="modal-button" onClick={handleDelete} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
                    Delete
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={() => props.setShowDelete(false)} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
                    Cancel
				</WButton>
            </WMFooter>

        </WModal>
    );
}

export default Delete;