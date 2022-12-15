import React, { useState, useEffect } from "react";
import {
    Stack,
    Typography,
    TextField,
    Button, Box,
    InputAdornment
} from "@mui/material";
import axiosInstance from "../../../helper/Axios";
import NumberFormat from "react-number-format";

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value
                    }
                });
            }}
            thousandSeparator="."
            decimalSeparator=","
        />
    );
}

const FundConfig = ({
    show, setShow, club, showSnackbar,
}) => {
    const [monthlyFund, setMonthlyFund] = useState(club ? club.monthlyFund : 0);
    const [monthlyFundPoint, setMonthlyFundPoint] = useState(club ? club.monthlyFundPoint : 0);

    const handleSaveConfig = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.patch(`/club/fundconfig/${club._id}`,
                JSON.stringify({
                    monthlyFund,
                    monthlyFundPoint
                }), {
                headers: { "Content-Type": "application/json" }
            })
            const data = res.data

        } catch (err) {
            if (err.response.data.error) {
                showSnackbar(err.response.data.error)
            }
        }
    }

    

    return (
        <div>
            <Stack direction="column" spacing={4}>
                <h2>Cài đặt quỹ</h2>
                <Stack direction="column" spacing={2.5} sx={{ width: '100%' }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="stretch"
                    >
                        <Typography sx={{ minWidth: 250 }}>Mức thu hàng tháng</Typography>
                        <TextField
                        id="formatted-numberformat-input"
                        name="numberformat"
                            value={monthlyFund}
                            fullWidth
                            label="Số tiền"
                            size="small"
                            onChange={e => {
                                setMonthlyFund(e.target.value)
                            }}
                            InputProps={{
                                inputComponent: NumberFormatCustom,
                                endAdornment: <InputAdornment position="end">đ</InputAdornment>
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="stretch"
                    >
                        <Typography sx={{ minWidth: 250 }}>Điểm cộng nếu nộp đúng hạn (+)</Typography>
                        <TextField
                            value={monthlyFundPoint}
                            fullWidth
                            label="Điểm"
                            size="small"
                            type="number"
                            onChange={e => {
                                setMonthlyFundPoint(e.target.value)
                            }}
                        />
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
            </Stack>
        </div>
    )
}

export default FundConfig;