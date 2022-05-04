import React, { useState, useEffect, useContext } from 'react'
import { Avatar, Box, Button, Tooltip, TextField, Modal } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import Group from './Group'
import AddGroup from './AddGroup'
import UpdateGroup from './UpdateGroup';
import DeleteGroup from './DeleteGroup';
import { UserContext } from '../../../UserContext'
import io from 'socket.io-client'
import { ENDPT } from '../../../helper/Helper';
import './TabGroup.css'

let socket

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#1B264D',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#1B264D',
  },
});

const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-30%, -45%)',
  width: 700,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

const TabGroup = ({ club_id }) => {
  const { user, setUser } = useContext(UserContext);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [leader, setLeader] = useState();
  const [groups, setGroups] = useState([]);
  const [groupSelected, setGroupSelected] = useState();
  const [search, setSearch] = useState();

  const handleUpdateGroup = (event, group) => {
    event.preventDefault();
    setGroupSelected(group)
    setShowFormUpdate(true)
  }

  const handleDeleteGroup = (event, group) => {
    event.preventDefault();
    setGroupSelected(group)
    setShowDialog(true)
  }

  const handleSearchGroups = (event) => {
    event.preventDefault();
    socket.emit('search-groups', club_id, search)
  }

  useEffect(() => {
    socket = io(ENDPT);
    socket.emit('get-user', club_id, 'leader')
    socket.emit('get-groups', club_id)
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [])

  useEffect(() => {
    socket.on('output-leader', res => {
      setLeader(res)
    })
  }, [leader])

  useEffect(() => {
    socket.on('output-groups', grs => {
      setGroups(grs)
    })
    socket.on('group-created', newGroup => {
      setGroups([...groups, newGroup])
    })
    socket.on('group-deleted', delGroup => {
      setGroups(groups.filter(group => group._id !== delGroup._id))
    })
    socket.on('deleted-member-from-group', gr => {
      const updateGroups = groups.map((elm) => {
        if (elm._id === gr._id) {
          return {
            ...elm,
            members: gr.members
          }
        }
        return elm;
      });
      setGroups(updateGroups)
    })
    socket.on('group-updated', gr => {
      const updateGroups = groups.map((elm) => {
        if (elm._id === gr._id) {
          return {
            ...elm,
            name: gr.name,
            members: gr.members
          }
        }
        return elm;
      });
      setGroups(updateGroups)
    })
    socket.on('groups-searched', grs => {
      setGroups(grs)
    })
  }, [groups])

  return (
    <div className='div-tabgroup'>
      <Modal
        open={showFormAdd}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormAdd(false);
        }}
      >
        <Box sx={style}>
          <AddGroup club_id={club_id} setShow={setShowFormAdd} />
        </Box>
      </Modal>
      <Modal
        open={showFormUpdate}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormUpdate(false);
        }}
      >
        <Box sx={style}>
          <UpdateGroup club_id={club_id} group={groupSelected} setShow={setShowFormUpdate} />
        </Box>
      </Modal>
      <DeleteGroup
        open={showDialog}
        setOpen={setShowDialog}
        socket={socket}
        group={groupSelected}
      />
      <div className='div-header-tabgroup'>
        <div className='div-search-tabgroup'>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { width: '30ch' },
            }}>
            <CustomTextField
              value={search}
              id="search-field-tabmember"
              label="Tìm kiếm nhóm"
              variant="standard"
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              onKeyPress={event => 
                event.key === 'Enter' ? handleSearchGroups(event) : null
              }
            />
          </Box>

          <Tooltip title='Tìm kiếm' placement='right-start'>
            <Button
              className='btn-search3'
              variant="text"
              disableElevation
              onClick={handleSearchGroups}
            >
              <SearchIcon sx={{ color: '#1B264D' }} />
            </Button>
          </Tooltip>
        </div>
        <div className='div-action-tabgroup'>
          {user?.username.includes('admin')
            || user?._id === leader?._id
            ? (<Button
              onClick={() => {
                setShowFormAdd(true)
              }}
              variant="contained"
              style={{ background: '#1B264D' }}>
              Thêm nhóm
            </Button>) : <></>}
        </div>

      </div>
      <div className='div-list-tabgroup'>
        {groups.length > 0 ?
          groups.map(group => (
            <Group key={group._id}
              data={group}
              socket={socket}
              handleDeleteGroup={(event) => {
                handleDeleteGroup(event, group)
              }}
              handleUpdateGroup={(event) => {
                handleUpdateGroup(event, group)
              }}
            />
          )) :
          (<div style={{ textAlign: 'center', marginTop: 100 }}>
            <span>Câu lạc bộ chưa có nhóm nào...</span>
          </div>)}
      </div>
    </div>
  )
}

export default TabGroup