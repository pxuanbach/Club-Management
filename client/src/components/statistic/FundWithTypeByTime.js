import React, { useState, useEffect } from "react";
import { Stack, FormControl, Select, MenuItem, InputLabel, Chip, Box, Button } from "@mui/material";
import axiosInstance from "../../helper/Axios";
import { Column } from '@ant-design/plots';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

const FundWithTypeByTime = ({ club, isExpand, expand }) => {
    const [data, setData] = useState([]);
    const [selectOption, setSelectOption] = useState('YYYY-MM-DD');
    const [chipColFund, setChipColFund] = useState(true);
    const [chipPayFund, setChipPayFund] = useState(true);
    let euroGerman = Intl.NumberFormat("en-DE");

    const handleChange = (event) => {
        setSelectOption(event.target.value);
    };

    const getData = async () => {
        try {
            let typeArr = []
            if (chipColFund) {
                typeArr.push("Thu")
            }
            if (chipPayFund) {
                typeArr.push("Chi")
            }
            const res = await axiosInstance.get(
                `statistic/club/${club._id}/fundwithtype`,
                {
                    params: {
                        selectOption,
                        typeArr
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
        isGroup: true,
        padding: 'auto',
        xField: 'Date',
        yField: 'value',
        seriesField: 'type',
        dodgePadding: 2,
        xAxis: {
            // type: 'time',
            tickCount: 5,
        },
        yAxis: {
            label: {
                formatter: (v) => `${euroGerman.format(v)}`,
            },
        },
        color: ({ type }) => {
            if (type === 'Thu') {
                return '#2e7d32';
            } else if (type === "Chi") {
                return '#d32f2f'
            }
            return '#1976d2';
        },
        label: {
            formatter: ({ value }) => {
                return euroGerman.format(value)
            },
            position: 'middle',
            layout: [
                {
                    type: 'interval-adjust-position',
                },
                {
                    type: 'interval-hide-overlap',
                },
                {
                    type: 'adjust-color',
                },
            ],
        },
        tooltip: {
            formatter: ({ type, value }) => {
                return {
                    name: type,
                    value: euroGerman.format(value) + ' đ'
                };
            },
        }
    };

    useEffect(() => {
        getData();
    }, [selectOption, chipColFund, chipPayFund]);

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
                    <h3>Thống kê quỹ theo từng loại </h3>
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
                    <Stack direction="row" spacing={1}>
                        <Chip
                            sx={{ minWidth: 60 }}
                            label="Thu"
                            color="success"
                            variant={chipColFund ? "filled" : "outlined"}
                            clickable={true}
                            onClick={() => setChipColFund(!chipColFund)}
                        />
                        <Chip
                            sx={{ minWidth: 60 }}
                            label="Chi"
                            color="error"
                            variant={chipPayFund ? "filled" : "outlined"}
                            clickable={true}
                            onClick={() => setChipPayFund(!chipPayFund)}
                        />
                    </Stack>
                </Box>
                <Button sx={{ p: 0, minWidth: 0, p: 0.6 }} onClick={expand}>
                    {isExpand ? <ZoomInMapIcon /> : <ZoomOutMapIcon />}
                </Button>
            </Box>
            <Column {...config} />
        </Stack>
    )
}

export default FundWithTypeByTime