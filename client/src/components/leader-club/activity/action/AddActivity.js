import React, { useState } from 'react'
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
import RangeDatePicker from '../utilities/RangeDatePicker';
import axiosInstance from '../../../../helper/Axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DynamicInputField } from '../ActivityConfig';
import SeverityOptions from '../../../../helper/SeverityOptions';

const AddActivity = ({ setShow, club_id, acitivityCreated, showSnackbar }) => {
    const date = new Date();
    const [title, setTitle] = useState();
    const [titleErr, setTitleErr] = useState('');
    const [startDate, setStartDate] = useState(date.setDate(date.getDate()));
    const [endDate, setEndDate] = useState(date.setDate(date.getDate() + 14));
    const [selectCriteriaOption, setSelectCriteriaOption] = useState("percent");
    const [joinPoint, setJoinPoint] = useState(0)
    const [inputFields, setInputFields] = useState([
        { percentOrQuantity: '', point: '' }
    ])

    const handleClose = () => {
        setShow(false)
    }

    const validateDate = (value) => {
        if (typeof value === 'number') {
            return value;
        } else {
            return Date.parse(value);
        }
    }

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

    const handleSave = (event) => {
        event.preventDefault();
        if (title) {
            if (validateInputFields()) {
                axiosInstance.post(`/activity/create`,
                    JSON.stringify({
                        "club": club_id,
                        "title": title,
                        "startDate": validateDate(startDate),
                        "endDate": validateDate(endDate),
                        "joinPoint": joinPoint,
                        "configType": selectCriteriaOption,
                        "configMilestone": inputFields
                    }), {
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => {
                    //response.data
                    acitivityCreated(response.data)
                    handleClose()
                }).catch(err => {
                    //err.response.data.error
                    showSnackbar(err.response.data.error)
                })
            }
        } else {
            setTitleErr('Tên hoạt động trống')
        }
    }

    return (
        <div>
            <h2 id="modal-modal-title">
                Thêm hoạt động mới
            </h2>
            <div id="modal-modal-description">
                <div className='addgroup-modal'>
                    <TextField
                        value={title}
                        size="small"
                        label="Tên hoạt động"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={(event) => {
                            setTitleErr('')
                            setTitle(event.target.value);
                        }}
                        helperText={titleErr}
                        error={titleErr}
                    />
                    <RangeDatePicker
                        startDateTitle="Ngày bắt đầu"
                        endDateTitle="Ngày kết thúc"
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />
                    <Stack spacing={2}>
                        <h3>Cài đặt hoạt động</h3>
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
                            justifyContent="space-between"
                        >
                            <Typography sx={{ minWidth: "200px" }}>
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
                    </Stack>
                    <div className='stack-right'>
                        <Button
                            variant="contained"
                            disableElevation
                            onClick={handleSave}>
                            Lưu
                        </Button>
                        <Button
                            variant="outlined"
                            disableElevation
                            onClick={handleClose}>
                            Hủy
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AddActivity