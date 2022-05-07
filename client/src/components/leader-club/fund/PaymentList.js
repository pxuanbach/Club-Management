import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';

const rows = [
  { id: 1, content: 'Nguyễn Tiến Đạt - đóng tiền quỹ', type: 'Thu', money: 100000, time: '14/04/2022' },
  { id: 2, content: 'Nguyễn Tiến Đạt - đóng tiền quỹ', type: 'Thu', money: 100000, time: '14/04/2022' },
  { id: 3, content: 'Tiền mua đồng phục', type: 'Chi', money: 100000, time: '14/04/2022' },
  { id: 4, content: 'Tiền mua dụng cụ', type: 'Chi', money: 100000, time: '14/04/2022' },
  { id: 5, content: 'Tiền mua dụng cụ', type: 'Chi', money: 100000, time: '14/04/2022' },
];

export default function DataTable() {
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      align: 'center',
      headerAlign: 'center',
      flex: 0.5,
    },
    {
      field: 'content',
      headerName: 'Nội dung',
      sortable: false,
      flex: 1.5
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
      field: 'money',
      headerName: 'Số tiền đóng',
      type: 'number',
      flex: 0.5

    },
    {
      field: 'link',
      headerName: 'Liên kết',
      flex: 0.7
    },
  ];

  return (
    <div style={{ height: 400, width: '95%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}