import React, { useState, useEffect } from "react";
import { Stack, FormControl, Select, MenuItem, InputLabel, Button, Box } from "@mui/material";
import axiosInstance from "../../helper/Axios";
import { Line } from '@ant-design/plots';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

const QuantitySubmittedMonthlyFundGrowthByTime = ({ club, isExpand, expand }) => {
    const [data, setData] = useState([]);
    const [selectOption, setSelectOption] = useState('YYYY-MM');

    const handleChange = (event) => {
        setSelectOption(event.target.value);
    };

    const getData = async () => {
        try {
            const res = await axiosInstance.get(
                `statistic/club/${club._id}/quantitysubmittedmonthlyfund`,
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
        yField: 'value',
        xAxis: {
            // type: 'timeCat',
            tickCount: 5,
        },
        height: 220,
        tooltip: {
            formatter: ({ value }) => {
                return {
                    name: "Số lượng",
                    value: value
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
                width: '100%',
                height: 400,
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
                    <h3>Biến động quỹ hàng tháng</h3>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small">Theo</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={selectOption}
                            label="Theo"
                            onChange={handleChange}
                        >
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

export default QuantitySubmittedMonthlyFundGrowthByTime