import React from "react";
import PropTypes from "prop-types";
import { Tabs } from "@mui/material";
import { a11yProps, CustomTab } from "./Tab";

export default function XlsxTab({ value, sheetName, setValue }) {
  //tab 위치 변경
  const tabhandleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={(e, v) => tabhandleChange(e, v)}
      aria-label="basic tabs example"
      TabIndicatorProps={{
        style: {
          backgroundColor: "#9741B5",
        },
      }}
    >
      {sheetName.map((item, index) => (
        <CustomTab
          key={index}
          disableRipple
          label={item}
          {...a11yProps(index)}
        />
      ))}
    </Tabs>
  );
}

XlsxTab.propTypes = {
  value: PropTypes.any,
  sheetName: PropTypes.any,
  setValue: PropTypes.any,
};
