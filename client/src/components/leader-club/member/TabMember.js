import React, { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Box,
  Button,
  Tooltip,
  TextField,
  Modal,
  Snackbar,
  Alert, Grid
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { UserContext } from "../../../UserContext";
import { Buffer } from "buffer";
import AddMembers from "./AddMembers";
import axiosInstance from "../../../helper/Axios";
import CustomDialog from "../../dialog/CustomDialog";
import moment from 'moment'
import FileDownload from 'js-file-download';
import "./TabMember.css";
import QuantityJoinByTime from "../../statistic/QuantityJoinByTime";
import QuantityLeaveByTime from "../../statistic/QuantityLeaveByTime";

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
  width: 800,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

const TabMember = ({ club }) => {
  let isLeader = false;
  const { user, setUser } = useContext(UserContext);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [search, setSearch] = useState();
  const [members, setMembers] = useState([]);
  const [membersSelected, setMembersSelected] = useState([]);
  let haveSelected = membersSelected.length <= 0;
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [options, setOptions] = useState();
  const [isExpandStatistic, setIsExpandStatistic] = useState(false);

  const showSnackbar = (message, options) => {
    setOptions(options);
    setAlertMessage(message);
    setOpenSnackbar(true);
  };

  const handleRemoveMembersFromClub = () => {
    axiosInstance
      .patch(
        `/club/removemembers/${club._id}`,
        JSON.stringify({
          members: membersSelected,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        if (res.data) {
          getMembers();
        }
      });
  };

  const handleChangeSearch = (event) => {
    setSearch(event.target.value);
  };

  const exportMembersFile = async (e) => {
    e.preventDefault()
    try {
      const res = await axiosInstance.get(`/export/members/${club._id}/${user._id}`, {
        headers: { "Content-Type": "application/vnd.ms-excel" },
        responseType: 'blob'
      });
      const data = res.data;
      if (data) {
        FileDownload(data, Date.now() + `-thanhvien_${club.name}.xlsx`)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleSearchMembers = async (event) => {
    event.preventDefault();
    setMembersSelected([]);

    if (search) {
      const encodedSearch = new Buffer(search).toString("base64");
      const res = await axiosInstance.get(
        `/club/searchmembers/${club._id}/${encodedSearch}`
      );

      const data = res.data;
      if (data) {
        setMembers(data);
      }
    } else {
      getMembers();
    }
  };

  const getMembers = async () => {
    const res = await axiosInstance.get(`/club/members/${club._id}`);

    const data = res.data;
    if (data) {
      setMembers(data);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

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
        return <Avatar src={value.row.img_url} />;
      },
    },
    {
      field: "name",
      headerName: "Họ và tên",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 200,
      flex: 1,
    },

    {
      field: "username",
      headerName: "Mã sinh viên",
      flex: 0.7,
    },
    { field: "email", headerName: "Email", flex: 1.5 },
    {
      field: "dateJoin",
      headerName: "Ngày gia nhập",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (value) => moment(value.row.dateJoin).format("DD/MM/YYYY HH:mm"),
    },
  ];

  if (user) {
    isLeader = user._id === club.leader._id;
  }
  return (
    <div className="div-tabmember">
      <Modal
        open={showFormAdd}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormAdd(false);
        }}
      >
        <Box sx={style}>
          <AddMembers
            user={user}
            club_id={club._id}
            setShowFormAdd={setShowFormAdd}
            getMembers={getMembers}
            showSnackbar={showSnackbar}
          />
        </Box>
      </Modal>
      <CustomDialog
        open={openDialog}
        setOpen={setOpenDialog}
        title="Đuổi thành viên"
        contentText={`Bạn có chắc muốn đuổi người này?`}
        handleAgree={handleRemoveMembersFromClub}
      />
      <Snackbar
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={options}>{alertMessage}</Alert>
      </Snackbar>
      <div className="members__head">
        <div className="members__card">
          <h3>Trưởng câu lạc bộ</h3>
          <div className="member-selected">
            <Avatar src={club.leader.img_url} />
            <div className="selected-info">
              <span>{club.leader.name}</span>
              <span>{club.leader.email}</span>
            </div>
          </div>
        </div>
        <div className="members__card">
          <h3>Thủ quỹ</h3>
          <div className="member-selected">
            <Avatar src={club.treasurer.img_url} />
            <div className="selected-info">
              <span>{club.treasurer.name}</span>
              <span>{club.treasurer.email}</span>
            </div>
          </div>
        </div>
      </div>
      <Box sx={{ width: '100%', p: 2, transition: '0.5s' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={isExpandStatistic ? 12 : 6}>
            <QuantityJoinByTime
              club={club}
              isExpand={isExpandStatistic}
              expand={() => setIsExpandStatistic(!isExpandStatistic)}
            />
          </Grid>
          <Grid item xs={isExpandStatistic ? 12 : 6}>
            <QuantityLeaveByTime
              club={club}
              isExpand={isExpandStatistic}
              expand={() => setIsExpandStatistic(!isExpandStatistic)}
            />
          </Grid>
        </Grid>
      </Box>
      <div className="div-table-tabmember">
        <div className="header-table-tabmember">
          <h3 className="name-h4">Thành viên (x)</h3>
          <div className="div-search-tabmember">
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
            {isLeader ? (
              <div className="stack-right">
                <Button
                  onClick={() => {
                    setShowFormAdd(true);
                  }}
                  className="btn-add-tabmember"
                  variant="contained"
                  disableElevation
                  style={{ background: "#1B264D" }}
                >
                  Thêm thành viên
                </Button>
                <Button
                  disabled={haveSelected}
                  onClick={() => setOpenDialog(true)}
                  variant={haveSelected ? "outlined" : "contained"}
                  disableElevation
                  style={{
                    background: haveSelected ? "transparent" : "#1B264D",
                  }}
                >
                  Đuổi thành viên
                </Button>
                <Button
                  onClick={exportMembersFile}
                  style={{ background: "#1B264D" }}
                  variant="contained"
                  disableElevation
                  startIcon={<i class="fa-solid fa-file-export"></i>}
                >
                  Xuất file
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div
          style={{
            height: 52 * 7 + 56 + 55,
            width: "96%",
            marginTop: "10px",
            marginLeft: "20px",
          }}
        >
          <DataGrid
            checkboxSelection={isLeader}
            getRowId={(r) => r._id}
            rows={members}
            columns={columns}
            pageSize={7}
            rowsPerPageOptions={[7]}
            onSelectionModelChange={setMembersSelected}
            selectionModel={membersSelected}
          />
        </div>
      </div>
    </div>
  );
};

export default TabMember;
