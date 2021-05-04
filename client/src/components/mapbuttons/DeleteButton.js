import React, { useState } 		 from 'react';
import { WButton } 	             from 'wt-frontend';
import Delete 					 from '../modals/Delete';

const DeleteButton = (props) => {
    const [showDelete, toggleShowDelete] 	= useState(false);

    const setShowDelete = () => {
        toggleShowDelete(!showDelete);
    }

    return (
        <>
        <WButton className='modal-button delete-map' onClick={setShowDelete} span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
            <i className="material-icons">close</i>
        </WButton>
        {showDelete && <Delete setShowDelete={setShowDelete} id={props.id} deleteMap={props.deleteMap}/>}
        </>
    );
};

export default DeleteButton;