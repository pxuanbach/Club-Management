import React, { useState } from 'react'
import {
  Avatar, Box, Popover, IconButton
} from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import moment from 'moment';
import UserCard from '../../../card/UserCard';
import './Comments.css'

const Comments = ({ comments, user, handleDeleteComment }) => {
  const [anchorUser, setAnchorUser] = useState(null);
  const [userSelected, setUserSelected] = useState()
  const openUserCard = Boolean(anchorUser);

  const handleShowPopover = (event, user, setAnchorEl) => {
    setAnchorEl(event.currentTarget);
    setUserSelected(user)
  };

  const handleClosePopover = (setAnchorEl) => {
    setAnchorEl(null);
  };

  return (
    <div className='comments-container'>
      {comments.map(comment => (
        <Box className='comments-item' key={comment._id}>
          <Avatar
            onClick={(e) => handleShowPopover(e, comment.author, setAnchorUser)}
            src={comment.author.img_url}
            sx={{ height: '30px', width: '30px', cursor: 'pointer' }}
          />
          <div className='comments-item__container'>
            <div className='comments-item__header'>
              <div className='comments-item__title'>
                <h4 onClick={(e) => handleShowPopover(e, comment.author, setAnchorUser)}>
                  {comment.author.name}
                </h4>
                <span>{moment(comment.createdAt).fromNow()}</span>
              </div>
              {user._id === comment.author._id ? (
                <div className='comments-item__actions'>
                  <span onClick={() => handleDeleteComment(comment._id)}>Xóa</span>
                </div>
              ) : <></>}
            </div>
            <div className='comments-item__content'>
              <p>{comment.content}</p>
            </div>
          </div>
        </Box>
      ))}
      <Popover
        open={openUserCard}
        anchorEl={anchorUser}
        onClose={() => handleClosePopover(setAnchorUser)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <UserCard user={userSelected} />
      </Popover>
    </div>
  )
}

export default Comments