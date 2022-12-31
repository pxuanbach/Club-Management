import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, Popover } from '@mui/material';
import UserCard from '../../card/UserCard';

export default function DataTable({ rows }) {
  const [anchorUser, setAnchorUser] = useState(null);
  const [userSelected, setUserSelected] = useState()
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
      flex: 1
    },
    {
      field: 'type',
      headerName: 'Loại',
      align: 'center',
      headerAlign: 'center',
      flex: 0.7,
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
      flex: 0.5,
      valueGetter: (value) => formatter.format(Date.parse(value.row.createdAt)) + 'p',
    },
    {
      field: 'total',
      headerName: 'Số tiền',
      type: 'number',
      flex: 0.5
    },
    {
      field: 'file_url',
      headerName: 'Tệp liên kết',
      flex: 0.6,
      headerAlign: 'center',
      align: 'center',
      renderCell: (value) => {
        return (
          <>
            {value.row.file_url ?
              <a href={value.row.file_url}>Link</a>
              : <></>}
          </>
        )
      }
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
    }
  ];

  return (
    <div style={{ paddingRight: '40px' }}>
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