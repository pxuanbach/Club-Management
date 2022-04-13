import React, {useState, useEffect} from 'react'
import { Avatar, Divider, Button, Tooltip, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import io from 'socket.io-client'
import { ENDPT } from '../../../../helper/Helper'

let socket;

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#1B264D',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#1B264D',
  },
});

const AddMember = ({club}) => {
  const [search, setSearch] = useState()

  const handleChangeSearch = event => {
    setSearch(event.target.value)
  }

  const handleSearch = event => {
    event.preventDefault();

  }

  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPT])

  return (
    <div>
      <div className='stack-left'>
              <CustomTextField
                id="search-field"
                label="Tìm kiếm thành viên"
                variant="standard"
                value={search}
                onChange={handleChangeSearch}
                size='small'
              />
            <Tooltip title='Tìm kiếm' placement='right-start'>
              <Button
                variant="text"
                disableElevation
                onClick={handleSearch}>
                <SearchIcon sx={{color: '#1B264D'}}/>
              </Button>
            </Tooltip>
          </div>
    </div>
  )
}

export default AddMember