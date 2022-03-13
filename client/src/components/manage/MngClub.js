import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip'
import './MngClub.css'

const handleEdit = (event, param) => {
  event.stopPropagation();
  console.log('click edit', param);
}

const handleBlock = (event, param) => {
  event.stopPropagation();
  //param.isblock = !param.isblock
}

const handleDelte = (event, param) => {
  event.stopPropagation();

}

const columns = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 70, 
    headerAlign: 'center', 
    align: 'center', 
    flex: 0.3,
    disableColumnMenu: true,
  },
  {
    field: 'img_url',
    headerName: 'Hình đại diện',
    disableColumnMenu: true,
    sortable: false,
    align: 'center',
    flex: 0.6,
    renderCell: (value) => {
      return (
        <Avatar src={value.row.img_url} />
      )
    }
  },
  { field: 'name', headerName: 'Tên câu lạc bộ', flex: 1.5 },
  { field: 'description', headerName: 'Mô tả', flex: 1.5 },
  { field: 'leader', headerName: "Trưởng CLB", flex: 1 },
  { field: 'members', headerName: "Thành viên", type: 'number', flex: 0.5 },
  { field: 'fund', headerName: 'Quỹ', type: 'number', flex: 0.5 },
  {
    field: 'btn-edit',
    headerName: '',
    align: 'center',
    flex: 0.4,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (value) => {
      return (
        <Tooltip title="Chỉnh sửa" placement="right-start">
          <Button disableElevation onClick={(event) => {
            handleEdit(event, value.row)
          }}><i class="fa-solid fa-pen-to-square" style={{ fontSize: 20 }}></i></Button>
        </Tooltip>
      )
    }
  },
  {
    field: 'btn-block',
    headerName: '',
    align: 'center',
    flex: 0.4,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (value) => {
      return (
        <Tooltip title={value.row.isblock ? "Gỡ chặn" : "Chặn"} placement="right-start">
          <Button disableElevation onClick={(event) => {
            handleBlock(event, value.row)
          }}>
            <i class={value.row.isblock ? "fa-solid fa-lock" : "fa-solid fa-lock-open"}
              style={{ fontSize: 20 }}></i>
          </Button>
        </Tooltip>
      )
    }
  },
  {
    field: 'btn-delete',
    headerName: '',
    align: 'center',
    flex: 0.4,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (value) => {
      return (
        <Tooltip title="Xóa" placement="right-start">
          <Button disableElevation onClick={(event) => {
            handleDelte(event, value.row)
          }}>
            <i class="fa-solid fa-trash-can"
              style={{ fontSize: 20 }}></i>
          </Button>
        </Tooltip>
      )
    }
  }
];

const rows = [
  {
    id: "1",
    img_url: "https://i.pinimg.com/564x/26/0e/13/260e13ad0a24c196d2bc97c8ac0249ca.jpg",
    name: "CLB Xuân Tình Nguyện",
    description: "Yêu thương mùa xuân Yêu thương mùa xuân Yêu thương mùa xuân Yêu thương mùa xuân Yêu thương mùa xuân Yêu thương mùa xuân Yêu thương mùa xuân",
    fund: 2500000,
    members: 89,
    leader: "Lê Công Huân",
    isblock: false
  },
  {
    id: "2",
    img_url: "https://i.pinimg.com/236x/02/34/ab/0234ab5b126388ee79234f7abfc0fe37.jpg",
    name: "CLB Data Science",
    description: "Logic is...",
    fund: 1400000,
    members: 20,
    leader: "Nguyễn Cung",
    isblock: false
  },
  {
    id: "3",
    img_url: "https://i.pinimg.com/236x/8f/c2/15/8fc215d887334f3701fa27d7e65e0e7b.jpg",
    name: "CLB Google Dev",
    description: "Dev là developer",
    fund: 500000,
    members: 19,
    leader: "Ninh Diêu",
    isblock: false
  },
  {
    id: "4",
    img_url: "https://i.pinimg.com/236x/02/34/ab/0234ab5b126388ee79234f7abfc0fe37.jpg",
    name: "CLB Data Science",
    description: "Logic is...",
    fund: 1400000,
    members: 101,
    leader: "Trần Bình An",
    isblock: true
  },
  {
    id: "5",
    img_url: "https://i.pinimg.com/236x/8f/c2/15/8fc215d887334f3701fa27d7e65e0e7b.jpg",
    name: "CLB Google Dev",
    description: "Dev là developer",
    fund: 500000,
    members: 5,
    leader: "Vũ Ngọc Tân",
    isblock: false
  },
  {
    id: "6",
    img_url: "https://i.pinimg.com/236x/02/34/ab/0234ab5b126388ee79234f7abfc0fe37.jpg",
    name: "CLB Data Science",
    description: "Logic is...",
    fund: 1400000,
    members: 8,
    leader: "Phạm Tuấn Kiệt",
    isblock: false
  },
  {
    id: "7",
    img_url: "https://i.pinimg.com/236x/8f/c2/15/8fc215d887334f3701fa27d7e65e0e7b.jpg",
    name: "CLB Google Dev",
    description: "Dev là developer",
    fund: 500000,
    members: 11,
    leader: "Nguyễn Tiến Đạt",
    isblock: true
  },
  {
    id: "8",
    img_url: "https://i.pinimg.com/236x/8f/c2/15/8fc215d887334f3701fa27d7e65e0e7b.jpg",
    name: "CLB Google Dev",
    description: "Dev là developer",
    fund: 500000,
    members: 11,
    leader: "Công Vinh",
    isblock: true
  },
  {
    id: "9",
    img_url: "https://i.pinimg.com/236x/8f/c2/15/8fc215d887334f3701fa27d7e65e0e7b.jpg",
    name: "CLB Google Dev",
    description: "Dev là developer",
    fund: 500000,
    members: 11,
    leader: "Công Vinh",
    isblock: true
  },
  {
    id: "10",
    img_url: "https://i.pinimg.com/236x/8f/c2/15/8fc215d887334f3701fa27d7e65e0e7b.jpg",
    name: "CLB Google Dev",
    description: "Dev là developer",
    fund: 500000,
    members: 11,
    leader: "Công Vinh",
    isblock: true
  },
  {
    id: "11",
    img_url: "https://i.pinimg.com/236x/8f/c2/15/8fc215d887334f3701fa27d7e65e0e7b.jpg",
    name: "CLB Google Dev",
    description: "Dev là developer",
    fund: 500000,
    members: 11,
    leader: "Công Vinh",
    isblock: true
  },
];

const ManageClub = () => {

  return (
    <div className='container'>
      <div className='mng__header'>
        <h2>Quản lý các câu lạc bộ</h2>
        <Stack className='header__stack' direction="row" spacing={2}>
          <Button className='header__btn-icon' variant="contained" disableElevation>
            <i class="fa-solid fa-plus"></i>
            <span>Tạo Câu lạc bộ mới</span>
          </Button>
        </Stack>
      </div>
      <div className='data-table'>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSize={8}
        />
      </div>

    </div>
  )
}

export default ManageClub