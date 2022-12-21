import React, { useState, useEffect } from "react";
import { Stack, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import axiosInstance from "../../helper/Axios";
import { Line } from '@ant-design/plots';


const QuantityJoinByTime = ({ club }) => {
    const [data, setData] = useState([]);
    const [selectOption, setSelectOption] = useState('YYYY-MM-DD');

    const handleChange = (event) => {
        setSelectOption(event.target.value);
    };

    const getData = async () => {
        try {
            const res = await axiosInstance.get(
                `statistic/club/${club._id}/member`,
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
            <Stack direction="row" spacing={1} alignItems="center">
                <h3>Số lượng thành viên tham gia </h3>
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
            </Stack>
            <Line {...config} />
        </Stack>
    )
}

export default QuantityJoinByTime