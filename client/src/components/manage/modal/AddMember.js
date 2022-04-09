import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import io from 'socket.io-client'
import { ENDPT } from '../../../helper/Helper';
import './AddMember.css'

let socket

const AddMember = ({
    title,
    memberSelected,
    setMemberSelected,
    errorText,
    setErrorText
}) => {
    const [openAutoComplete, setOpenAutoComplete] = useState(false);
    const [users, setUsers] = useState([])

    const handleSearchMembers = event => {
        event.preventDefault();
        socket.emit('search-user', event.target.value)
    }

    useEffect(() => {
        socket = io(ENDPT);
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPT])

    useEffect(() => {
        socket.on('output-search-user', result => {
            setUsers(result)
            //console.log(result)
        })
    }, [users])

    if (memberSelected) {
        setErrorText('')
    }
    return (
        <div className='add-member'>
            <Autocomplete id='search-members'
                fullWidth 
                open={openAutoComplete}
                onOpen={() => {
                    setOpenAutoComplete(true);
                }}
                onClose={() => {
                    setOpenAutoComplete(false);
                }}
                onChange={(event, value) => {
                    setMemberSelected(value)
                }}
                noOptionsText='Không tìm thấy'
                options={users}
                getOptionLabel={(option) => option.username}
                renderInput={(params) => (
                    <TextField {...params}
                        onChange={handleSearchMembers}
                        id="add-members"
                        variant="outlined"
                        label={title}
                        size="small"
                        error={errorText}
                        helperText={errorText}
                    />
                )}
            />
            {memberSelected && <div className='member-selected'>
                <Avatar src={memberSelected.img_url} />
                <div className='selected-info'>
                    <span>{memberSelected.name}</span>
                    <span>{memberSelected.email}</span>
                </div>
            </div>}
        </div>
    )
}

export default AddMember