import React, { useState }  from 'react';
import { WButton, WNavItem, WInput } from 'wt-frontend';	
import EditMapName 					 from '../modals/EditMapName';

const EditMapButton = (props) => {
    const [showEdit, toggleShowEdit] 	= useState(false);

    const setShowEdit = () => {
        toggleShowEdit(!showEdit);
    }

    return (
        <>
        <WButton className='modal-button edit-map-name' onClick={setShowEdit} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
        <i className="material-icons">create</i>
        </WButton>
        {showEdit && <EditMapName setShowEdit={setShowEdit} id={props.id} name={props.name} editMapName={props.editMapName}/>}
        </>
    );
};

export default EditMapButton;