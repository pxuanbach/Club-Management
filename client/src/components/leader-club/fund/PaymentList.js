import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';

const rows = [
  { _id: 1, content: 'Nguyễn Tiến Đạt - đóng tiền quỹ', type: 'Thu', total: 100000, createAt: '14/04/2022', author: { name: 'Phạm Xuân Bách'} },
  { _id: 2, content: 'Nguyễn Tiến Đạt - đóng tiền quỹ', type: 'Thu', total: 100000, createAt: '14/04/2022', author: { name: 'Nguyễn Tiến Đạt'} },
  { _id: 3, content: 'Tiền mua đồng phục', type: 'Chi', total: 100000, createAt: '14/04/2022', author: { name: 'Nguyễn Tiến Đạt'} },
  { _id: 4, content: 'Tiền mua dụng cụ', type: 'Chi', total: 100000, createAt: '14/04/2022', author: { name: 'Nguyễn Tiến Đạt'} },
  { _id: 5, content: 'Tiền mua dụng cụ', type: 'Chi', total: 100000, createAt: '14/04/2022', author: { name: 'Nguyễn Ngọc Thịnh'} },
  { _id: 6, content: 'Tiền mua dụng cụ', type: 'Chi', total: 100000, createAt: '14/04/2022', author: { name: 'Hồ Quang Linh'} },
];

export default function DataTable() {
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
          <Chip sx={{p: 1, fontSize: 14}}
            label={value.row.type}
            color={value.row.type === "Thu" ? "success" : "error"}
          />
        )
      }
    },
    {
      field: 'createAt',
      headerName: 'Thời gian',
      flex: 0.6,
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
      flex: 0.7
    },
    {
      field: 'author',
      headerName: 'Người tạo',
      flex: 0.7,
      valueGetter: (value) => value.row.author.name
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