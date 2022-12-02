import React, { useState, useEffect } from "react";
import { Avatar, Button, Tooltip, TextField, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import axiosInstance from "../../../helper/Axios";
import SeverityOptions from "../../../helper/SeverityOptions";

const CustomTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#1B264D",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#1B264D",
  },
});

const AddPoints = ({
  user, club, setShowFormAdd, membersSelected, showSnackbar, getMemberPoints
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [point, setPoint] = useState(0);

  const handleClose = () => {
    setShowFormAdd(false);
  };

  const handleAddPoints = async (e) => {
    e.preventDefault();
    try {
      if (reason.trim() !== '') {
        const res = await axiosInstance.post(
          `/point/club/${club._id}/multi`,
          JSON.stringify({
            title: reason,
            value: point,
            author: user._id,
            users: membersSelected.map(obj => obj._id)
          }), {
          headers: { "Content-Type": "application/json" }
        })
        const data = res.data
        if (data) {
          showSnackbar("Tạo phiếu điểm thành công.", SeverityOptions.success)
          await getMemberPoints()
          handleClose()
        }
      }
    } catch (err) {
      showSnackbar(err.response.data.error, SeverityOptions.error)
    }
  };

  const columns = [
    {
      field: "img_url",
      headerName: "Hình đại diện",
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      flex: 0.6,
      renderCell: (value) => {
        return <Avatar src={value.row.data.img_url} />;
      },
    },
    {
      field: "name",
      headerName: "Họ và tên",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      flex: 1,
      valueGetter: (value) => value.row.data.name,
    },
    {
      field: "username",
      headerName: "Mã sinh viên",
      flex: 0.7,
      valueGetter: (value) => value.row.data.username,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      valueGetter: (value) => value.row.data.email,
    },
  ];

  return (
    <div className="addmember-modal">
      <h2>Tạo phiếu điểm</h2>
      <Stack direction="row" spacing={1}>
        <TextField
          sx={{ width: '100%' }}
          label="Lý do"
          id="outlined-size-small"
          defaultValue="Small"
          size="small"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <TextField
          label="Điểm"
          id="outlined-size-small"
          defaultValue="Small"
          size="small"
          type="number"
          value={point}
          onChange={(e) => setPoint(e.target.value)}
        />
      </Stack>
      <div className="members__body">
        <DataGrid
          sx={{ height: 52 * 4 + 56 + 55 }}
          getRowId={(r) => r._id}
          rows={membersSelected}
          columns={columns}
          pageSize={5}
        />
      </div>
      <div className="stack-right">
        <Button
          disabled={isLoading}
          onClick={handleAddPoints}
          variant="contained"
          disableElevation
        >
          Xác nhận
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleClose}
          variant="outlined"
          disableElevation
        >
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default AddPoints;
