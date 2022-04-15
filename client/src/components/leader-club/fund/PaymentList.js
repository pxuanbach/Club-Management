import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'STT', width: 70 },
  {
    field: 'content', 
    headerName: 'Nội dung',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 200,
    flex:1
  },
  { field: 'type', headerName: 'Loại', width: 150,flex:0.5 },

  {
    field: 'money',
    headerName: 'Số tiền đóng',
    type: 'number',
    width: 150,
    flex:0.5
    
  },
  { field: 'link', headerName: 'Liên kết', width: 150,flex:0.5 },
];

const rows = [
  { id: 1, content: 'Nguyễn Tiến Đạt - đóng tiền quỹ', type: 'Thu', money: 100000,time:'14/04/2022' },
  { id: 2, content: 'Nguyễn Tiến Đạt - đóng tiền quỹ', type: 'Thu', money: 100000,time:'14/04/2022' },
  { id: 3, content: 'Tiền mua đồng phục', type: 'Chi', money: 100000,time:'14/04/2022' },
  { id: 4, content: 'Tiền mua dụng cụ', type: 'Chi', money: 100000,time:'14/04/2022' },
  { id: 5, content: 'Tiền mua dụng cụ', type: 'Chi', money: 100000,time:'14/04/2022' },
];

export default function DataTable() {
  return (
    <div style={{ height: 400, width: '95%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}