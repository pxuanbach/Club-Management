import React, { useState, useEffect, useContext } from "react";
import AddClub from "../manage/modal/AddClub";
import {
  Box,
  Modal,
  Alert,
  Snackbar,
  styled,
  TextField,
  Tooltip,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import "./Home.css";
import ClubItem from "./ClubItem";
import axiosInstance from "../../helper/Axios";
import { Link } from "react-router-dom";
import { Buffer } from "buffer";
import SeverityOptions from "../../helper/SeverityOptions";

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
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

const Home = ({user}) => {
  const [showFormAddClub, setShowFormAddClub] = useState(false);
  const [search, setSearch] = useState();
  const [clubs, setClubs] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [options, setOptions] = useState();

  const showSnackbar = (message, options) => {
    setOptions(options);
    setAlertMessage(message);
    setOpenSnackbar(true);
  };

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search) {
      const encodedSearch = new Buffer(search).toString("base64");
      const res = await axiosInstance.get(
        `/club/usersearch/${user._id}/${encodedSearch}`
      );

      const data = res.data;
      //console.log(data)
      if (data) {
        setClubs(data);
      }
    } else {
      getListClub();
    }
  };

  const getListClub = async () => {
    // let isAdmin = user?.username.includes("admin");
    let res = await axiosInstance.get(`/club/list/${user._id}`, {
      headers: { "Content-Type": "application/json" },
    });
    let data = res.data;
    if (data) {
      setClubs(data);
    }
  };

  useEffect(() => {
    getListClub();
  }, []);

  return (
    <div>
      <Modal
        open={showFormAddClub}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={() => {
          setShowFormAddClub(false);
        }}
      >
        <Box sx={style}>
          <AddClub
            setShowFormAdd={setShowFormAddClub}
            clubs={clubs}
            setClubs={setClubs}
            showSnackbar={showSnackbar}
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
      <div className="div-body">
        <div className="header-body">
          <div className="header-title"> Câu lạc bộ của tôi</div>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
            sx={{ marginRight: '20px' }}
          >
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              justifyContent="flex-end"
            >
              <CustomTextField
                id="search-field"
                label="Tìm kiếm (Tên Câu lạc bộ)"
                variant="standard"
                value={search}
                onChange={handleChangeSearch}
                size="small"
                onKeyPress={(event) =>
                  event.key === "Enter" ? handleSearch(event) : null
                }
              />
              <Tooltip title="Tìm kiếm" placement="right-start">
                <Button
                  className="btn-search"
                  variant="text"
                  disableElevation
                  onClick={handleSearch}
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
                  onClick={getListClub}
                >
                  <RefreshIcon sx={{ color: "#1B264D" }} />
                </Button>
              </Tooltip>
            </Stack>
            {user.username.includes("admin") ? (
              <Button
                style={{ background: "#1B264D" }}
                variant="contained"
                disableElevation
                startIcon={<i class="fa-solid fa-plus"></i>}
                onClick={() => {
                  setShowFormAddClub(true);
                }}
              >
                Tạo Câu lạc bộ mới
              </Button>
            ) : null}
          </Stack>
        </div>
        <div className="div-card-team">
          {clubs &&
            clubs.map((club) => (
              <Link
                key={club._id}
                style={{ textDecoration: "none" }}
                to={
                  club.isblocked
                    ? "#"
                    : "/club/" + club._id + "/" + club.name + "/message"
                }
                onClick={() => {
                  club.isblocked ? (
                    showSnackbar(
                      "Câu lạc bộ này đã bị chặn",
                      SeverityOptions.warning
                    )
                  ) : (
                    <></>
                  );
                }}
              >
                <ClubItem club={club} />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
