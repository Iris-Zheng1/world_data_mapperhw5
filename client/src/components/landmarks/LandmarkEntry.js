import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import DeleteRegion 					 from '../modals/DeleteRegion';

const LandmarkEntry = (props) => {
    const name = props.entry;

    const [editingName, toggleNameEdit] = useState(false);
    
    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'No Name';
        const prevName = name;
        console.log(e.target.value)
        props.editLandmark(props.index, newName);
    };

    const handleDeleteLandmark = () => {
        props.deleteLandmark(props.index);
    }

    return (
        <WRow>
            <WCol size="1">
            <WButton className="delete-landmark-button" onClick={handleDeleteLandmark} size="small" span={false} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded"><i className="material-icons">close</i></WButton>
            </WCol>
            <WCol size="11">
                {
                    editingName || name === ''
                        ? <WInput
                            className='table-input' onBlur={handleNameEdit}
                            autoFocus={true} defaultValue={name} type='text'
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        />
                        : <div className="table-text"
                            onClick={() => toggleNameEdit(!editingName)}
                        >{props.entry}
                        </div>
                }
            </WCol>
        </WRow>
    );
};

export default LandmarkEntry;