import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Buffer } from 'buffer';
import './FindMember.css'
import axiosInstance from '../../../helper/Axios';

const FindMember = ({
    title,
    memberSelected,
    setMemberSelected,
    errorText,
    setErrorText
}) => {
    const [openAutoComplete, setOpenAutoComplete] = useState(false);
    const [users, setUsers] = useState([])

    const handleSearchMembers = async event => {
        event.preventDefault();
        //socket.emit('search-user', event.target.value)
        if (event.target.value.trim()) {
            const encodedSearch = new Buffer(event.target.value).toString('base64');
            const res = await axiosInstance.get(`/user/search/${encodedSearch}`)

            const data = res.data;
            //console.log(data)
            if (data) {
                setUsers(data)
            }
        } else {
            setUsers([])
        }
    }

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

export default FindMember