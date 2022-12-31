import React, { useState, useEffect } from 'react';
import {
    Modal, Button, Tooltip, Box, TextField, styled,
    Alert, Snackbar, Grid, Stack,
} from '@mui/material';
import axiosInstance from '../../../helper/Axios';
import MonthlyFundList from './MonthlyFundList';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FundConfig from './FundConfig';
import AddMonthlyFund from './AddMonthlyFund';
import moment from 'moment';
import MonthlyFundGrowthByTime from '../../statistic/MonthlyFundGrowthByTime';
import QuantitySubmittedMonthlyFundGrowthByTime from '../../statistic/QuantitySubmittedMonthlyFundByTime';

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
    width: 900,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
};

const MonthlyFundtab = ({ club_id, user }) => {
    const [club, setClub] = useState()
    const [fundHistorys, setFundHistorys] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showFormConfig, setShowFormConfig] = useState(false);
    const [showFormAddMonthlyFund, setShowFormAddMonthlyFund] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('error');
    const [search, setSearch] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isTreasurer, setIsTreasurer] = useState(false);
    // const isTreasurer = Boolean(user._id === club.treasurer._id);
    const [isExpandStatistic, setIsExpandStatistic] = useState(false);

    const handleChangeSearch = (event) => {
        setSearch(event.target.value)
    }

    const showSnackbar = (message, option = 'error') => {
        setAlertMessage(message)
        setSeverity(option)
        setOpenSnackbar(true);
    }

    const getFundHistories = () => {
        axiosInstance.get(`/fund/monthlyfund/${club_id}`, {
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
                // console.log(response.data)
                setFundHistorys(response.data.funds)
            }).catch(err => {
                //err.response.data.error
                showSnackbar(err.response.data.error)
            })
    }

    const verifyClub = async () => {
        try {
            const res = await axiosInstance.get(`/club/one/${club_id}`, {
                withCredentials: true,
            });
            const data = res.data;
            //console.log('club', data)
            setIsTreasurer(user._id === data.treasurer._id)
            setClub(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // console.log(club)
        verifyClub()
    }, [])

    useEffect(() => {
        getFundHistories()
    }, [club, currentMonth])

    return (
        <div>
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity={severity}>{alertMessage}</Alert>
            </Snackbar>
            {club && <>
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
                            setClub={setClub}
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
                    <Box sx={{ width: '100%', p: 2, transition: '0.5s' }}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={isExpandStatistic ? 12 : 6}>
                                <QuantitySubmittedMonthlyFundGrowthByTime
                                    club={club}
                                    isExpand={isExpandStatistic}
                                    expand={() => setIsExpandStatistic(!isExpandStatistic)}
                                />
                            </Grid>
                            <Grid item xs={isExpandStatistic ? 12 : 6}>
                                <MonthlyFundGrowthByTime
                                    club={club}
                                    isExpand={isExpandStatistic}
                                    expand={() => setIsExpandStatistic(!isExpandStatistic)}
                                />
                            </Grid>
                        </Grid>

                    </Box>
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="flex-end">
                        <Stack direction="row" spacing={1} alignItems="flex-end">
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
                        <MonthlyFundList rows={fundHistorys} user={user} />
                    </Box>
                </Box >
            </>}
        </div >
    )
}

export default MonthlyFundtab