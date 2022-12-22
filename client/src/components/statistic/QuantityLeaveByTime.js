import React, { useState, useEffect } from "react";
import { Stack, FormControl, Select, MenuItem, InputLabel, Box, Button } from "@mui/material";
import axiosInstance from "../../helper/Axios";
import { Line } from '@ant-design/plots';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

const QuantityLeaveByTime = ({ club, isExpand, expand }) => {
    const [data, setData] = useState([]);
    const [selectOption, setSelectOption] = useState('YYYY-MM-DD');

    const handleChange = (event) => {
        setSelectOption(event.target.value);
    };

    const getData = async () => {
        try {
            const res = await axiosInstance.get(
                `statistic/club/${club._id}/memberleave`,
                {
                    params: {
                        selectOption
                    }
                }
            )
            const data = res.data
            setData(data)
        } catch (err) {
            console.log(err)
        }
    }

    const config = {
        data,
        padding: 'auto',
        xField: 'Date',
        yField: 'scales',
        xAxis: {
            // type: 'timeCat',
            tickCount: 5,
        },
        height: 220,
        tooltip: {
            formatter: ({scales}) => {
                return { 
                    name: "Số lượng", 
                    value: scales 
                };
              },
        }
    };

    useEffect(() => {
        getData();
    }, [selectOption]);

    return (
        <Stack spacing={1.5}
            sx={{
                paddingX: 4,
                paddingY: 2,
                width: '100%',
                height: 300
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <h3>Số lượng thành viên rời khỏi</h3>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small">Theo</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={selectOption}
                            label="Theo"
                            onChange={handleChange}
                        >
                            <MenuItem value="YYYY-MM-DD">Ngày</MenuItem>
                            <MenuItem value="YYYY-MM">Tháng</MenuItem>
                            <MenuItem value="YYYY">Năm</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button sx={{ p: 0, minWidth: 0, p: 0.6 }} onClick={expand}>
                    {isExpand ? <ZoomInMapIcon /> : <ZoomOutMapIcon />}
                </Button>
            </Box>
            <Line {...config} />
        </Stack>
    )
}

export default QuantityLeaveByTime