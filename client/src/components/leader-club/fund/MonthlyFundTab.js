import React, { useState, useEffect } from 'react';
import {
    Modal, Button, Tooltip, Box, TextField, styled,
    Alert, Snackbar, CircularProgress, Stack,
} from '@mui/material';
import axiosInstance from '../../../helper/Axios';
import MonthlyFundList from './MonthlyFundList';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FundConfig from './FundConfig';
import AddMonthlyFund from './AddMonthlyFund';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#1B264D',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#1B264D',
    },
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
};

const styleAddMonthlyFund = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
};

const MonthlyFundtab = ({ club, user }) => {
    const [fundHistorys, setFundHistorys] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showFormConfig, setShowFormConfig] = useState(false);
    const [showFormAddMonthlyFund, setShowFormAddMonthlyFund] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [search, setSearch] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const isTreasurer = Boolean(user._id === club.treasurer._id)

    const handleChangeSearch = (event) => {
        setSearch(event.target.value)
    }

    const showSnackbar = (message) => {
        setAlertMessage(message)
        setOpenSnackbar(true);
    }

    const getFundHistories = () => {
        axiosInstance.get(`/fund/monthlyfund/${club._id}`, {
            params: {
                applyFilter: false,
                startDate: new Date(moment().startOf("month")),
                endDate: new Date(moment().endOf("month")),
                search: search
            },
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                //response.data
                console.log(response.data)
                setFundHistorys(response.data.funds)
            }).catch(err => {
                //err.response.data.error
                showSnackbar(err.response.data.error)
            })
    }

    useEffect(() => {
        console.log(club)
        getFundHistories()
    }, [])

    useEffect(() => {
        getFundHistories()
    }, [currentMonth])

    return (
        <div>
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity="error">{alertMessage}</Alert>
            </Snackbar>
            <Modal
                open={showFormConfig}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClose={() => {
                    setShowFormConfig(false);
                }}
            >
                <Box sx={style}>
                    <FundConfig
                        show={showFormConfig}
                        setShow={setShowFormConfig}
                        club={club}
                        showSnackbar={showSnackbar}
                        isReadOnly={!isTreasurer}
                    />
                </Box>
            </Modal>
            <Modal
                open={showFormAddMonthlyFund}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClose={() => {
                    setShowFormAddMonthlyFund(false);
                    getFundHistories();
                }}
            >
                <Box sx={styleAddMonthlyFund}>
                    <AddMonthlyFund
                        show={showFormAddMonthlyFund}
                        setShow={setShowFormAddMonthlyFund}
                        club={club}
                        showSnackbar={showSnackbar}
                        isReadOnly={false}
                    />
                </Box>
            </Modal>
            <Box sx={{ marginTop: 6, p: 2 }}>
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="flex-end">
                    <Stack direction="row" spacing={1} alignItems="flex-end">
                        {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                size="small"
                                views={['year', 'month']}
                                label="Tháng"
                                inputFormat='MM/YYYY'
                                maxDate={moment()}
                                value={currentMonth}
                                onChange={(newValue) => {
                                    setCurrentMonth(newValue);
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        size='small'
                                        sx={{ width: 150 }}
                                        helperText={null}
                                    />
                                }
                            />
                        </LocalizationProvider> */}
                        <Box
                            sx={{
                                '& > :not(style)': { width: '30ch' },
                            }}
                        >
                            <CustomTextField
                                value={search}
                                onChange={handleChangeSearch}
                                id="search-field-tabmember"
                                label="Tìm kiếm phiếu thu/chi"
                                variant="standard"
                                onKeyPress={event => event.key === 'Enter' ? getFundHistories() : null}
                            />
                        </Box>
                        <Tooltip title='Tìm kiếm' placement='right-start'>
                            <Button
                                className='btn-search3'
                                variant="text"
                                disableElevation
                                onClick={getFundHistories}
                            >
                                <SearchIcon sx={{ color: '#1B264D' }} />
                            </Button>
                        </Tooltip>
                        <Tooltip title='Làm mới' placement='right-start'>
                            <Button sx={{ borderColor: '#1B264D' }}
                                className='btn-refresh'
                                variant="outlined"
                                disableElevation
                                onClick={getFundHistories}>
                                <RefreshIcon sx={{ color: '#1B264D' }} />
                            </Button>
                        </Tooltip>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        {isTreasurer ? <Tooltip title='Xác nhận quỹ tháng' placement='right-start'>
                            <Button
                                onClick={() => setShowFormAddMonthlyFund(true)}
                                style={{ background: '#1B264D' }}
                                className='btn-confirm-monthlyfund'
                                variant="contained"
                                disableElevation
                                startIcon={<PlaylistAddCheckIcon />}>
                                Xác nhận quỹ tháng
                            </Button>
                        </Tooltip> : <></>}
                        <Tooltip title='Cài đặt quỹ' placement='right-start'>
                            <Button
                                onClick={() => setShowFormConfig(true)}
                                style={{ background: '#1B264D' }}
                                className='btn-config'
                                variant="contained"
                                disableElevation
                                startIcon={<SettingsIcon />}>
                                Cài đặt
                            </Button>
                        </Tooltip>
                    </Stack>
                </Stack>
                <Box sx={{ paddingY: 2, paddingX: 2 }}>
                    <MonthlyFundList rows={fundHistorys} user={user}/>
                </Box>
            </Box >
        </div >
    )
}

export default MonthlyFundtab