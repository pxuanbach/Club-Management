import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
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

const columns = [
  { field: 'id', headerName: 'ID', width: 70, headerAlign: 'center', align: 'center' },
  {
    field: 'img_url',
    headerName: 'Hình đại diện',
    width: 120,
    align: 'center',
    renderCell: (value) => {
      return (
        <Avatar src={value.row.img_url} />
      )
    }
  },
  { field: 'name', headerName: 'Tên câu lạc bộ', width: 300 },
  { field: 'description', headerName: 'Mô tả', width: 300 },
  {
    field: 'fund',
    headerName: 'Quỹ',
    type: 'number',
    width: 120,
  },
  {
    field: 'btn-edit',
    headerName: '',
    align: 'center',
    renderCell: (value) => {
      return (
        <Tooltip title="Chỉnh sửa" placement="right-start">
          <Button onClick={(event) => {
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
    renderCell: (value) => {
      return (
        <Tooltip title={value.row.isblock ? "Gỡ chặn" : "Chặn"} placement="right-start">
          <Button onClick={(event) => {
            handleEdit(event, value.row)
          }}>
            <i class={value.row.isblock ? "fa-solid fa-lock" : "fa-solid fa-lock-open"} style={{ fontSize: 20 }}></i>
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
    description: "Yêu thương mùa xuân",
    fund: 2500000,
    isblock: false
  },
  {
    id: "2",
    img_url: "https://i.pinimg.com/236x/02/34/ab/0234ab5b126388ee79234f7abfc0fe37.jpg",
    name: "CLB Data Science",
    description: "Logic is...",
    fund: 1400000,
    isblock: false
  },
  {
    id: "3",
    img_url: "https://i.pinimg.com/236x/8f/c2/15/8fc215d887334f3701fa27d7e65e0e7b.jpg",
    name: "CLB Google Dev",
    description: "Dev là developer",
    fund: 500000,
    isblock: false
  },
  {
    id: "4",
    img_url: "https://i.pinimg.com/236x/02/34/ab/0234ab5b126388ee79234f7abfc0fe37.jpg",
    name: "CLB Data Science",
    description: "Logic is...",
    fund: 1400000,
    isblock: true
  },
  {
    id: "5",
    img_url: "https://i.pinimg.com/236x/8f/c2/15/8fc215d887334f3701fa27d7e65e0e7b.jpg",
    name: "CLB Google Dev",
    description: "Dev là developer",
    fund: 500000,
    isblock: false
  },
  {
    id: "6",
    img_url: "https://i.pinimg.com/236x/02/34/ab/0234ab5b126388ee79234f7abfc0fe37.jpg",
    name: "CLB Data Science",
    description: "Logic is...",
    fund: 1400000,
    isblock: false
  },
  {
    id: "7",
    img_url: "https://i.pinimg.com/236x/8f/c2/15/8fc215d887334f3701fa27d7e65e0e7b.jpg",
    name: "CLB Google Dev",
    description: "Dev là developer",
    fund: 500000,
    isblock: true
  },
];

const ManageClub = () => {

  return (
    <div className='container'>

      <div className='data-table'>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
        />
      </div>

    </div>
  )
}

export default ManageClub