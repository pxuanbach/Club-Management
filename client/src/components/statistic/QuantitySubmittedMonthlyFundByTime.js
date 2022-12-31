import React, { useState, useEffect } from "react";
import { 
    Stack, FormControl, Select, MenuItem, InputLabel, 
    Button, Box, Tooltip, 
} from "@mui/material";
import axiosInstance from "../../helper/Axios";
import { Line } from '@ant-design/plots';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import RefreshIcon from '@mui/icons-material/Refresh'

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
                    gap: 1
                }}>
                    <h3>Số lượng thành viên nộp quỹ hàng tháng</h3>
                    <Tooltip title='Làm mới' placement='right-start'>
                        <Button sx={{ borderColor: '#1B264D' }}
                            className='btn-refresh'
                            variant="outlined"
                            disableElevation
                            onClick={getData}>
                            <RefreshIcon sx={{ color: '#1B264D' }} />
                        </Button>
                    </Tooltip>
                    {/* <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
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
                    </FormControl> */}
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