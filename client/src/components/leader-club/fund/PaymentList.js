import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';

export default function DataTable({ rows }) {
  let formatter = new Intl.DateTimeFormat(['ban', 'id'], {
    hour: 'numeric', minute: 'numeric',
    year: "numeric", month: "numeric", day: "numeric",  
  });

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
            color={value.row.type === "Thu" ? "success" : "error"}
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
      field: 'file_url',
      headerName: 'Tệp liên kết',
      flex: 0.7,
      headerAlign: 'center',
      align: 'center',
      renderCell: (value) => {
        return (
          <a href={value.row.file_url}>Link</a>
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
          <a href='#'>{value.row.author.name}</a>
        )
      }
    }
  ];

  return (
    <div style={{ width: '95%' }}>
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