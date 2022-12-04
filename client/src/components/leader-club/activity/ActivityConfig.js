import React, { useState, useEffect, useContext } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  TextField,
  Tooltip,
  styled,
  tooltipClasses,
  Button,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import axiosInstance from "../../../helper/Axios";
import { UserContext } from "../../../UserContext";
import SeverityOptions from "../../../helper/SeverityOptions";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const ActivityConfig = ({ show, setShow, activityId }) => {
  const [selectCriteriaOption, setSelectCriteriaOption] = useState("percent");
  const [selectWayCalOption, setSelectWayCalOption] = useState(0);
  const [criteriaValue, setCriteriaValue] = useState(0);
  const [wayCalTip, setWayCalTip] = useState("");

  const handleChangeCriteriaValue = (e) => {
    e.preventDefault();
    if (selectCriteriaOption === "percent") {
      if (e.target.value >= 0 && e.target.value <= 100) {
        setCriteriaValue(e.target.value);
      }
    } else {
      setCriteriaValue(e.target.value);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {

    } catch (err) {
        console.log(err.response.data.error)
    }
  }

  const getCurrentConfig = async () => {
    try {

    } catch (err) {
        console.log(err.response.data.error)
    }
  }

  useEffect(() => {
    getCurrentConfig()
  }, [])

  useEffect(() => {
    if (selectWayCalOption === 0) {
      setWayCalTip(
        "Chỉ những người tham gia hoàn thành được tiêu chí hoàn thành mới được tính điểm những thẻ hoạt động đã tham gia."
      );
    } else if (selectWayCalOption === 1) {
      setWayCalTip(
        "Những người tham gia được tính điểm từ thẻ hoạt động đã tham gia (bất kể tiêu chí hoàn thành)."
      );
    }
  }, [selectWayCalOption]);

  return (
    <div>
      <Stack direction="column" spacing={4}>
        <h2>Cài đặt hoạt động</h2>
        <Stack direction="column" spacing={3}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="stretch"
          >
            <Typography sx={{ minWidth: "150px" }}>
              Tiêu chí hoàn thành
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
              <InputLabel id="filter-select-small">Loại tiêu chí</InputLabel>
              <Select
                labelId="filter-select-small"
                id="filter-select-small"
                value={selectCriteriaOption}
                onChange={(e) => {
                  setCriteriaValue(0);
                  setSelectCriteriaOption(e.target.value);
                }}
                label="Loại tiêu chí"
              >
                <MenuItem value="percent">Phần trăm</MenuItem>
                <MenuItem value="quantity">Số lượng</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="thẻ tham gia"
              value={criteriaValue}
              size="small"
              type="number"
              onChange={handleChangeCriteriaValue}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="stretch"
          >
            <Typography sx={{ minWidth: "150px" }}>Cách tính điểm</Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="filter-select-small">Cách tính</InputLabel>
              <Select
                labelId="filter-select-small"
                id="filter-select-small"
                value={selectWayCalOption}
                onChange={(e) => {
                  setSelectWayCalOption(e.target.value);
                }}
                label="Cách tính"
              >
                <MenuItem value={0}>Tính điểm theo tiêu chí hoàn thành</MenuItem>
                <MenuItem value={1}>Tính điểm theo thẻ hoạt động</MenuItem>
              </Select>
            </FormControl>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <Typography>{wayCalTip}</Typography>
                </React.Fragment>
              }
            >
              <HelpIcon sx={{ cursor: "pointer" }} />
            </HtmlTooltip>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            onClick={handleSaveConfig}
            variant="contained"
            disableElevation
          >
            Lưu
          </Button>
          <Button
            onClick={() => setShow(false)}
            variant="outlined"
            disableElevation
          >
            Hủy
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};

export default ActivityConfig;
