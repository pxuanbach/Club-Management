import React, { useState, useEffect, FC, useMemo } from "react";
import {
  Avatar,
  TextField,
  styled,
  Button,
  Tooltip,
  Stack,
  Box,
  IconButton,
} from "@mui/material";
import BlockUi from 'react-block-ui';
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import axiosInstance from "../../../../helper/Axios";
import MaterialReactTable from "material-react-table";
import CustomDialog from "../../../dialog/CustomDialog";

const CustomTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#1B264D",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#1B264D",
  },
});

const CollaboratorsInActivity = ({
  setShow, activityId, showSnackbar, 
  isFinished, isLeader, isSumaried
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState();
  const [collaborators, setCollaborators] = useState([]);
  const [collaboratorCardSelected, setCollaboratorCardSelected] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const isReadOnly = !Boolean(!isFinished && isLeader)

  const handleChangeSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleRemoveCollaborators = () => {
    setIsLoading(true);
    axiosInstance
      .patch(
        `/activity/card/userexit/${collaboratorCardSelected.cardId}`,
        JSON.stringify({
          userId: collaboratorCardSelected.collabId,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        //response.data
        getCollaborators();
        setIsLoading(false);
      })
      .catch((err) => {
        //err.response.data.error
        showSnackbar(err.response.data.error);
      });
  };

  const getCollaborators = () => {
    setIsLoading(true)
    axiosInstance
      .get(`/point/activity/${activityId}`, {
        params: {
          search: search,
        },
      })
      .then((response) => {
        //response.data
        const data = response.data;
        setCollaborators(data);
      })
      .catch((err) => {
        //err.response.data.error
        console.log(err);
        showSnackbar(err.response.data.error);
      })
      .finally(() => {
        setIsLoading(false)
      })
  };

  useEffect(() => {
    getCollaborators();
  }, []);

  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: "img_url",
        columnDefType: 'display',
        size: 12,
        Cell: ({ row }) => (
          <>
            {row.original.subRows !== undefined &&
              <Avatar src={row.original.img_url} sx={{ width: 30, height: 30 }} />}
          </>
        ),
      },
      {
        accessorKey: "username",
        header: "Tài khoản",
        // columnDefType: 'display',
        size: 30,
      },
      {
        accessorKey: "name",
        header: "Tên",
        size: 150,
      },

      {
        accessorKey: "email",
        header: "Email",
        size: 150,
      },
      {
        accessorKey: "point",
        header: "Điểm",
        size: 20,
      },
      {
        accessorKey: "quantityCard",
        // enableColumnOrdering: false,
        header: "Số thẻ tham gia",
        size: 30,
      },
    ],
    []
    //end
  );

  return (
    <BlockUi tag="div" blocking={isLoading} className="addmember-modal">
      <CustomDialog
        open={openDialog}
        setOpen={setOpenDialog}
        title="Mời rời khỏi thẻ"
        contentText={`Bạn có chắc muốn mời ${collaboratorCardSelected.collabName} rời khỏi thẻ này?`}
        handleAgree={handleRemoveCollaborators}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <h2>Cộng tác viên</h2>
        <Button
          disabled={isLoading}
          onClick={handleClose}
          variant="text"
          disableElevation
        >
          <CloseIcon sx={{ color: "#1B264D" }} />
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div className="stack-left">
          <CustomTextField
            id="search-field"
            label="Tìm kiếm"
            variant="standard"
            value={search}
            onChange={handleChangeSearch}
            size="small"
            onKeyPress={(event) =>
              event.key === "Enter" ? getCollaborators() : null
            }
          />
          <Tooltip title="Tìm kiếm" placement="right-start">
            <Button variant="text" disableElevation onClick={getCollaborators}>
              <SearchIcon sx={{ color: "#1B264D" }} />
            </Button>
          </Tooltip>
          <Tooltip title="Làm mới" placement="right-start">
            <Button
              sx={{ borderColor: "#1B264D" }}
              className="btn-refresh"
              variant="outlined"
              disableElevation
              onClick={getCollaborators}
            >
              <RefreshIcon sx={{ color: "#1B264D" }} />
            </Button>
          </Tooltip>
        </div>
      </Stack>
      <div className="members__body">
        <MaterialReactTable
          columns={columns}
          data={collaborators}
          enableExpanding
          enableExpandAll //default
          enableRowActions={!isSumaried && isLeader}
          initialState={{ density: "compact" }}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          paginateExpandedRows={false}
          displayColumnDefOptions={{
            "mrt-row-actions": {
              header: "",
              size: 20,
            },
          }}
          renderRowActions={({ row }) => {
            return (
              <>
                {row.original.subRows === undefined &&
                  row.original.username !== "Tên thẻ tham gia" ? (
                  <Tooltip title="Đuổi khỏi thẻ">
                    <IconButton
                      onClick={() => {
                        setCollaboratorCardSelected(row.original);
                        setOpenDialog(true);
                      }}
                    >
                      <HighlightOffIcon sx={{ color: "#1B264D" }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </>
            );
          }}
          positionActionsColumn="last"
          muiTablePaginationProps={{
            rowsPerPageOptions: [10, 20],
            showFirstLastPageButtons: false,
          }}
        />
      </div>
    </BlockUi>
  );
};

export default CollaboratorsInActivity;
