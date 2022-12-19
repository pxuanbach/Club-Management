import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, Popover, Tooltip, Button, Box, Modal } from '@mui/material';
import UserCard from '../../card/UserCard';
import ViewMonthlyFund from './ViewMonthlyFund';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

export default function MonthlyFundList({ rows }) {
  const [anchorUser, setAnchorUser] = useState(null);
  const [userSelected, setUserSelected] = useState();
  const [showFormViewMonthlyFund, setShowFormViewMonthlyFund] = useState(false);
  const [fundSelected, setFundSelected] = useState();
  const openUserCard = Boolean(anchorUser);
  let formatter = new Intl.DateTimeFormat(['ban', 'id'], {
    hour: 'numeric', minute: 'numeric',
    year: "numeric", month: "numeric", day: "numeric",
  });

  const handleShowPopover = (event, data, setDate, setAnchorEl) => {
    setAnchorEl(event.currentTarget);
    setDate(data)
  };

  const handleClosePopover = (setAnchorEl) => {
    setAnchorEl(null);
  };

  const handleShowCheckMonthlyFund = (event, param) => {
    event.stopPropagation();
    setFundSelected(param);
    setShowFormViewMonthlyFund(true)
  }

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      align: 'center',
      headerAlign: 'center',
      flex: 0.5,
    },
    {
      field: 'content',
      headerName: 'Nội dung',
      sortable: false,
      flex: 1.2
    },
    {
      field: 'type',
      headerName: 'Loại',
      align: 'center',
      headerAlign: 'center',
      flex: 0.5,
      renderCell: (value) => {
        return (
          <Chip sx={{ p: 1, fontSize: 14 }}
            label={value.row.type}
            color={value.row.type === "Thu" ? "success" : value.row.type === "Chi" ? "error" : "primary"}
          />
        )
      }
    },
    {
      field: 'createdAt',
      headerName: 'Thời gian',
      flex: 0.7,
      valueGetter: (value) => formatter.format(Date.parse(value.row.createdAt)) + 'p',
    },
    {
      field: 'total',
      headerName: 'Số tiền',
      type: 'number',
      flex: 0.5
    },
    {
      field: 'author',
      headerName: 'Người tạo',
      flex: 0.8,
      valueGetter: (value) => value.row.author.name,
      renderCell: (value) => {
        return (
          <a href='#' onClick={(e) =>
            handleShowPopover(e, value.row.author, setUserSelected, setAnchorUser)
          }>
            {value.row.author.name}
          </a>
        )
      }
    },
    {
      field: 'btn-checkList',
      headerName: '',
      align: 'center',
      flex: 0.4,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (value) => {
        return (
          <Tooltip title="Danh sách nộp quỹ" placement="right-start">
            <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
              handleShowCheckMonthlyFund(event, value.row)
              //console.log('block?', value.row.isblocked)
            }}>
              <FormatListBulletedIcon sx={{ color: '#1B264D' }} />
            </Button>
          </Tooltip>
        )
      }
    },
  ];

  return (
    <div>
      <Modal
        open={showFormViewMonthlyFund}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={() => {
          setShowFormViewMonthlyFund(false);
        }}
      >
        <Box sx={style}>
          <ViewMonthlyFund
            show={showFormViewMonthlyFund}
            setShow={setShowFormViewMonthlyFund}
            fund={fundSelected}
          />
        </Box>
      </Modal>
      <Popover
        open={openUserCard}
        anchorEl={anchorUser}
        onClose={() => handleClosePopover(setAnchorUser)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <UserCard
          user={userSelected}
          isLeader={false}
        />
      </Popover>
      <DataGrid
        getRowId={(r) => r._id}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
      />
    </div>
  );
}