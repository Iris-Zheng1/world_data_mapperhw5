import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const LandmarkParent = (props) => {
    const parent = props.selectedMap._id;

    const [editingParent, toggleParentEdit] = useState(false);
    
    const handleParentEdit = (e) => {
        toggleParentEdit(false);
        const newParent = e.target.value ? e.target.value : parent;
        const prevParent = parent;
        props.changeParent(props.selectedRegion._id, prevParent, newParent);
    };

    return (
        <>
        {
            editingParent ? <div>Parent Region: <select
            className='parent-select' onBlur={handleParentEdit}
            autoFocus={true} defaultValue={props.selectedMap.name}
                >
                {props.maps.map( map => <option value={map._id}>{map.name}</option>)}
            </select></div>
            : <div onClick={() => toggleParentEdit(!editingParent)}>
                Parent Region: {props.selectedMap.name}
            </div>
        }</>
    );
};

export default LandmarkParent;