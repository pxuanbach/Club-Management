import React, { useState, useEffect } from 'react'
import AddClub from './AddClub';
import { styled, Box } from "@mui/system";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import "./Home.css";
const options = [
  'Ẩn',
  'Xóa',
];
const ITEM_HEIGHT = 48;


const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;
const Home = (props) => {
  const [showFormAddClub, setShowFormAddClub] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={showFormAddClub}
        onClose={() => {
          setShowFormAddClub(false);
        }}
        BackdropComponent={Backdrop}
      >
        <AddClub setShowFormAddClub={setShowFormAddClub} />
      </StyledModal>

      <div className='div-header'>
        <div className='div-search'>
          <input
            type="text"
            placeholder="Tìm kiếm câu lạc bộ"

          />
          <i class="fa-solid fa-magnifying-glass"></i>

        </div>
      </div>

      <div className='div-body'>
        <div className='header-body'>
          <div className='header-title'> Câu lạc bộ của bạn</div>
          <div className='div-btnadd'>
            <button onClick={() => setShowFormAddClub(true)} className='btnAdd' >Tạo câu lạc bộ</button>
            <i class="fa-solid fa-plus"></i>
          </div>
        </div>
        <div className='div-card-team'>
          <div className='card-team'>   
            <div className='div-menu'>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon className='icon-menu' />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '15ch',
                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option} selected={option === 'Ẩn'} onClick={handleClose}>
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>
            <a href='/club' style={{textDecoration: 'none'}}>
              <div className='image-team'>
              </div>
              <div className='name-team'>
                CLB Chạy bộ
              </div>
              <div className='div-activity'></div>
            </a>
          </div>
          <div className='card-team'>
            {/* <i className="fa-solid fa-ellipsis"></i> */}
            <div className='div-menu'>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon className='icon-menu' />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '15ch',
                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option} selected={option === 'Ẩn'} onClick={handleClose}>
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>
            <a href='/club' style={{textDecoration: 'none'}}>
              <div className='image-team'>
              </div>
              <div className='name-team'>
                CLB Chạy bộ
              </div>
              <div className='div-activity'>
              </div>
            </a>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Home