import React, { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Box,
  Button,
  Tooltip,
  TextField,
  Modal,
  Snackbar,
  Alert,
  Stack, Checkbox, FormControlLabel
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { styled } from "@mui/material/styles";
import { UserContext } from "../../../UserContext";
import RangeDatePicker from "../activity/utilities/RangeDatePicker";
import axiosInstance from "../../../helper/Axios";
import PointDetail from "./detail/PointDetail";
import AddPoints from "./AddPoints";
import "./TabMember.css";
import SeverityOptions from '../../../helper/SeverityOptions'
import FileDownload from 'js-file-download';
import moment from "moment";

const CustomTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#1B264D",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#1B264D",
  },
});

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-30%, -45%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

const TabPoint = ({ club }) => {
  let isLeader = false;
  const { user, setUser } = useContext(UserContext);
  const [showFormDetail, setShowFormDetail] = useState(false);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState([]);
  const [memberSelected, setMemberSelected] = useState();
  const [membersSelected, setMembersSelected] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [options, setOptions] = useState();
  const [startDate, setStartDate] = useState(
    new Date(moment().startOf("month"))
  );
  const [endDate, setEndDate] = useState(new Date(moment().endOf("month")));
  const [justCurrentMember, setJustCurrentMember] = useState(true);
  let haveSelected = membersSelected.length <= 0;

  const showSnackbar = (message, options) => {
    setOptions(options);
    setAlertMessage(message);
    setOpenSnackbar(true);
  };

  const handleChangeSearch = (event) => {
    setSearch(event.target.value);
  };

  const exportMemberPointsFile = async (e) => {
    e.preventDefault()
    try {
      const res = await axiosInstance.get(`/export/memberpoints/${club._id}/${user._id}`, {
        params: {
          startDate: startDate,
          endDate: endDate,
          justCurrentMember: justCurrentMember ? "true" : "false",
        },
        headers: { "Content-Type": "application/vnd.ms-excel" },
        responseType: 'blob'
      });
      const data = res.data;
      if (data) {
        FileDownload(data, Date.now() + `-diem_thanhvien_${club.name}.xlsx`)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleSearchMembers = async (event) => {
    event.preventDefault();
    setMembersSelected([]);
    if (search) {
      const res = await axiosInstance.get(
        `/point/club/${club._id}`,
        {
          params: {
            startDate: startDate,
            endDate: endDate,
            justCurrentMember: justCurrentMember ? "true" : "false",
            search: search
          }
        }
      );

      const data = res.data;
      if (data) {
        setMembers(data);
      }
    } else {
      getMemberPoints();
    }
  };

  const handleShowDetail = async (event, param) => {
    event.stopPropagation();
    setMemberSelected(param);
    setShowFormDetail(true);
  };

  const getMemberPoints = async () => {
    try {
      const res = await axiosInstance.get(`/point/club/${club._id}`, {
        params: {
          startDate: startDate,
          endDate: endDate,
          justCurrentMember: justCurrentMember ? "true" : "false"
        },
      });
      const data = res.data;
      if (data) {
        setMembers(data);
      }
    } catch (err) {
      showSnackbar(err.response.data.error, SeverityOptions.error)
    }
  };

  useEffect(() => {
    getMemberPoints();
  }, []);

  useEffect(() => {
    getMemberPoints();
  }, [startDate, endDate, justCurrentMember]);

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
    {
      field: "point",
      headerName: "Điểm",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "btn-detail",
      headerName: "",
      align: "center",
      flex: 0.4,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (value) => {
        return (
          <Tooltip title="Cập nhật" placement="right-start">
            <Button
              style={{ color: "#1B264D" }}
              disableElevation
              onClick={(event) => {
                handleShowDetail(event, value.row);
              }}
            >
              <i class="fa-solid fa-circle-info" style={{ fontSize: 20 }}></i>
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  if (user) {
    isLeader = user._id === club.leader._id;
  }
  return (
    <div className="div-tabmember">
      <Modal
        open={showFormDetail}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormDetail(false);
        }}
      >
        <Box sx={style}>
          <PointDetail
            user={user}
            club={club}
            memberSelected={memberSelected}
            startDate={startDate}
            endDate={endDate}
            setShowFormDetail={setShowFormDetail}
          />
        </Box>
      </Modal>
      <Modal
        open={showFormAdd}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormAdd(false);
        }}
      >
        <Box sx={style}>
          <AddPoints
            user={user}
            club={club}
            membersSelected={membersSelected}
            setShowFormAdd={setShowFormAdd}
            showSnackbar={showSnackbar}
            getMemberPoints={getMemberPoints}
          />
        </Box>
      </Modal>
      <Snackbar
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={options}>{alertMessage}</Alert>
      </Snackbar>

      <div className="div-table-tabmember">
        <h2 style={{ marginLeft: '20px', marginBottom: '20px' }}>Bảng điểm</h2>
        <div className="header-table-tabmember">
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ marginLeft: "20px", width: 'max-content' }}
          >
            <span>Lọc</span>
            <RangeDatePicker
              textCenter="-"
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
            <FormControlLabel
              sx={{ minWidth: 'max-content' }}
              control={
                <Checkbox
                  checked={justCurrentMember}
                  onChange={(e) => setJustCurrentMember(e.target.checked)}
                />
              }
              label="Chỉ thành viên hiện tại"
            />
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: "flex",
              alignItems: "flex-end",
              marginRight: "20px",
            }}
          >
            <Box
              sx={{
                "& > :not(style)": { width: "30ch" },
              }}
            >
              <CustomTextField
                value={search}
                onChange={handleChangeSearch}
                id="search-field-tabmember"
                label="Tìm kiếm thành viên "
                variant="standard"
                onKeyPress={(event) =>
                  event.key === "Enter" ? handleSearchMembers(event) : null
                }
              />
            </Box>
            <Tooltip title="Tìm kiếm" placement="right-start">
              <Button
                variant="text"
                disableElevation
                onClick={handleSearchMembers}
              >
                <SearchIcon sx={{ color: "#1B264D" }} />
              </Button>
            </Tooltip>
            <Tooltip title="Làm mới" placement="right-start">
              <Button
                sx={{ borderColor: "#1B264D" }}
                className="btn-refresh"
                variant="outlined"
                disableElevation
                onClick={getMemberPoints}
              >
                <RefreshIcon sx={{ color: "#1B264D" }} />
              </Button>
            </Tooltip>
            {isLeader && <>
              <Button
                disabled={haveSelected}
                onClick={() => {
                  console.log(membersSelected)
                  setShowFormAdd(true)
                }}
                variant={haveSelected ? "outlined" : "contained"}
                disableElevation
                startIcon={<i class="fa-solid fa-plus"></i>}
                style={{
                  background: haveSelected ? "transparent" : "#1B264D",
                }}
              >
                Phiếu điểm
              </Button>
              <Button
                onClick={exportMemberPointsFile}
                style={{ background: "#1B264D" }}
                variant="contained"
                disableElevation
                startIcon={<i class="fa-solid fa-file-export"></i>}
              >
                Xuất file
              </Button>
            </>}
          </Stack>
        </div>
        <div
          style={{
            height: 52 * 9 + 56 + 55,
            width: "100%",
            marginTop: "10px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <DataGrid
            checkboxSelection={isLeader}
            getRowId={(r) => r._id}
            rows={members}
            columns={columns}
            pageSize={9}
            rowsPerPageOptions={[9]}
            onSelectionModelChange={(ids) => {
              const selected = members.filter((member) => {
                return ids.includes(member._id)
              })
              // console.log(membersSelected)
              setMembersSelected(selected)
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TabPoint;
