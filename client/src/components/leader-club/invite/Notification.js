import React from "react";
import { Box, Stack } from "@mui/material";
import NavTabs from "./Tab-Notification";

const Notification = ({club}) => {
  return (
    <Box sx={{ width: "100%", height: '100vh'}}>
      <Stack direction="column"
       spacing={1}
        sx={{
          width: "50%",
          minWidth: '600px',
          height: '100%',
          justifyContent: "flex-start",
          margin: "auto",
          padding: '20px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
        }}
      >
        <h1>Lời mời</h1>
        <NavTabs club={club}/>
      </Stack>
    </Box>
  );
};

export default Notification;
