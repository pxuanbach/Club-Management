import React, { useContext } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ActivitiesNotification from "./ActivitiesNotification";
import ClubNotification from "./ClubNotification";
import { UserContext } from "../../../UserContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function NotificationTab({ club }) {
  const { user } = useContext(UserContext);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", height: "auto" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Câu lạc bộ" {...a11yProps(0)} />
          <Tab label="Hoạt động" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Box sx={{ overflowY: "scroll" }}>
        <TabPanel value={value} index={0}>
          <ClubNotification club={club} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ActivitiesNotification club={club} />
        </TabPanel>
      </Box>
    </Box>
  );
}
