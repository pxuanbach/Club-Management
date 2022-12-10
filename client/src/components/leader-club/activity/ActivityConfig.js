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
  Button, Box
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axiosInstance from "../../../helper/Axios";
import { UserContext } from "../../../UserContext";
import SeverityOptions from "../../../helper/SeverityOptions";

export const DynamicInputField = ({
  inputFields, selectCriteriaOption,
  handlePercentOrQuantityChange, sortInputFields,
  handleFormChange, removeFields
}) => {

  return (
    <Stack
      fullWidth
      spacing={2}
    >
      {inputFields.map((input, index) => {
        return (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Typography sx={{ minWidth: "70px" }}>
              Mốc {index + 1}
            </Typography>
            <TextField
              name="percentOrQuantity"
              label={selectCriteriaOption === "percent" ? "Tỉ lệ (%)" : "Số lượng"}
              value={input.percentOrQuantity}
              size="small"
              type="number"
              onChange={event => handlePercentOrQuantityChange(index, event)}
              // onMouseLeave={sortInputFields}
              // onPointerLeave={sortInputFields}
              // onMouseOut={sortInputFields}
              onBlur={sortInputFields}
            />
            <TextField
              name="point"
              label="Điểm đạt được"
              value={input.point}
              size="small"
              type="number"
              onChange={event => handleFormChange(index, event)}
            />
            <Button onClick={() => removeFields(index)}>
              <RemoveCircleIcon />
            </Button>
          </Stack>
        )
      })}
    </Stack>
  )
}

const ActivityConfig = ({ show, setShow, activityId, showSnackbar }) => {
  const [selectCriteriaOption, setSelectCriteriaOption] = useState("percent");
  const [joinPoint, setJoinPoint] = useState(0)
  const [inputFields, setInputFields] = useState([
    { percentOrQuantity: '', point: '' }
  ])

  const handlePercentOrQuantityChange = (index, event) => {
    let data = [...inputFields];
    if (selectCriteriaOption === "percent") {
      if (event.target.value >= 0 && event.target.value <= 100) {
        data[index]["percentOrQuantity"] = event.target.value;
        setInputFields(data);
      }
    } else {
      data[index]["percentOrQuantity"] = event.target.value;
      setInputFields(data);
    }
  }

  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  }

  const addFields = () => {
    if (inputFields.length < 5) {
      let newfield = { percentOrQuantity: '', point: '' }
      setInputFields([...inputFields, newfield])
    } else {
      showSnackbar("Chỉ có thể thêm tối đa 5 mốc điểm.", SeverityOptions.warning)
    }
  }

  const removeFields = (index) => {
    if (inputFields.length > 1) {
      let data = [...inputFields];
      data.splice(index, 1)
      setInputFields(data)
    } else {
      showSnackbar("Phải có ít nhất 1 mốc điểm.", SeverityOptions.warning)
    }
  }

  const validateInputFields = () => {
    let isOk = true
    inputFields.forEach((input, index) => {
      if (input.percentOrQuantity === null || input.percentOrQuantity === "") {
        isOk = false
        showSnackbar(`Giá trị ở mốc ${index + 1} trống`, SeverityOptions.warning)
      }
      if (input.point === "" || input.point === null) {
        isOk = false
        showSnackbar(`Giá trị ở mốc ${index + 1} trống`, SeverityOptions.warning)
      }
    })
    return isOk
  }

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      if (validateInputFields()) {
        const res = await axiosInstance.patch(
          `/activity/config/${activityId}`,
          JSON.stringify({
            "joinPoint": joinPoint,
            "configType": selectCriteriaOption,
            "configMilestone": inputFields
          }),
          {
            headers: { "Content-Type": "application/json" }
          }
        )
        const data = res.data
        setJoinPoint(data.joinPoint)
        setSelectCriteriaOption(data.configType)
        setInputFields(data.configMilestone)
        showSnackbar("Cập nhật cài đặt hoạt động thành công!", SeverityOptions.success)
      }
    } catch (err) {
      console.log(err)
      showSnackbar(err.response.data.error, SeverityOptions.error)
    }
  }

  const getCurrentConfig = async () => {
    try {
      const res = await axiosInstance.get(`/activity/one/${activityId}`)
      const data = res.data
      // console.log(data)
      setJoinPoint(data.joinPoint)
      setSelectCriteriaOption(data.configType)
      setInputFields(data.configMilestone)
    } catch (err) {
      console.log(err.response.data.error)
      showSnackbar(err.response.data.error, SeverityOptions.error)
    }
  }

  useEffect(() => {
    getCurrentConfig()
  }, [])

  const sortInputFields = () => {
    setInputFields((current) => {
      const newArr = [...current];
      newArr.sort((a, b) => {
        if (a["percentOrQuantity"] !== "" || b["percentOrQuantity"] !== "") {
          return a["percentOrQuantity"] - b["percentOrQuantity"]
        }
      });
      return newArr;
    });
  }

  return (
    <div>
      <Stack direction="column" spacing={4}>
        <h2>Cài đặt hoạt động</h2>
        <Stack direction="column" spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fullWidth sx={{ minWidth: "200px" }}>
              Chỉ cần tham gia là được cộng (+)
            </Typography>
            <TextField
              value={joinPoint}
              label="Điểm"
              size="small"
              type="number"
              onChange={e => setJoinPoint(e.target.value)}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="stretch"
          >
            <Typography sx={{ minWidth: "150px" }}>
              Tiêu chí hoàn thành
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 160 }} fullWidth size="small">
              <InputLabel id="filter-select-small">Loại tiêu chí</InputLabel>
              <Select
                labelId="filter-select-small"
                id="filter-select-small"
                value={selectCriteriaOption}
                onChange={(e) => {
                  setInputFields([
                    { percentOrQuantity: '', point: '' }
                  ])
                  setSelectCriteriaOption(e.target.value);
                }}
                label="Loại tiêu chí"
              >
                <MenuItem value="percent">Tỉ lệ thẻ tham gia</MenuItem>
                <MenuItem value="quantity">Số lượng thẻ tham gia</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <span><i>Hoàn thành được tính từ <b>mốc 1</b> và chỉ tính các thẻ ở cột <b>đã xong</b>.</i></span>
          <Stack
            fullWidth
            sx={{ borderLeft: '5px solid #1976d2', paddingLeft: '20px' }}
            spacing={2}
          >
            <DynamicInputField
              inputFields={inputFields}
              selectCriteriaOption={selectCriteriaOption}
              handlePercentOrQuantityChange={handlePercentOrQuantityChange}
              sortInputFields={sortInputFields}
              handleFormChange={handleFormChange}
              removeFields={removeFields}
            />
            <Button onClick={addFields} startIcon={<AddCircleIcon />}>Thêm mốc...</Button>
          </Stack>
          {/* <Stack
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
          </Stack> */}
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
      </Stack>

    </div>
  );
};

export default ActivityConfig;
