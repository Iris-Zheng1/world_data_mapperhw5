import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const RegionEntry = (props) => {
    const { entry } = props;
    const images = require.context('../../images/The World', true);

    const name = entry.name;
    const capital = entry.capital;
    const leader = entry.leader;

    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'No Name';
        const prevName = name;
        props.editRegion(entry._id, 'name', newName, prevName);
    };

    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : 'No Capital';
        const prevCapital = capital;
        props.editRegion(entry._id, 'capital', newCapital, prevCapital);
    };

    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : 'No Leader';
        const prevLeader = capital;
        props.editRegion(entry._id, 'leader', newLeader, prevLeader);
    };
    /*
    const assigned_to = data.assigned_to;

    const [editingStatus, toggleStatusEdit] = useState(false);
    const[editingAssigned, toggleAssignedEdit] = useState(false);

    const handleAssignedEdit = (e) => {
        toggleAssignedEdit(false);
        const newAssignment = e.target.value ? e.target.value : "Not Assigned";
        const prevAssignment = assigned_to;
        props.editItem(data._id, 'assigned_to', newAssignment,prevAssignment);
    }*/
    const findFlag = (flag) => {
        try {
            images(flag)
            return true
        } catch (err) {
         return false;
        }
      };

    return (
        <WRow className='table-entry'>
            <WCol size="3">
                {
                    editingName || name === ''
                        ? <WInput
                            className='table-input' onBlur={handleNameEdit}
                            autoFocus={true} defaultValue={name} type='text'
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        />
                        : <div className="table-text"
                            onClick={() => toggleNameEdit(!editingName)}
                        >{name}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingCapital || capital === ''
                    ? <WInput
                        className='table-input' onBlur={handleCapitalEdit}
                        autoFocus={true} defaultValue={capital} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                    : <div className="table-text"
                        onClick={() => toggleCapitalEdit(!editingCapital)}
                    >{capital}
                    </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingLeader || leader === ''
                    ? <WInput
                        className='table-input' onBlur={handleLeaderEdit}
                        autoFocus={true} defaultValue={leader} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                    : <div className="table-text"
                        onClick={() => toggleLeaderEdit(!editingLeader)}
                    >{leader}
                    </div>
                }
            </WCol>
            <WCol size="1">
                {
                    findFlag('./'+name+' Flag.png') ? <img className="flag" src={images('./'+name+' Flag.png')}/>: <i className="material-icons flag">flag</i>
                }
            </WCol>
            
            <WCol size="4">
                <div className="table-text">{props.entry.landmarks+"..."}</div>
            </WCol>
        </WRow>
    );
};

export default RegionEntry;