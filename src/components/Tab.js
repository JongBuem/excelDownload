import { Tab } from "@mui/material";
import { styled } from "@mui/material/styles";

export const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export const CustomTab = styled(Tab)(() => ({
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 1.5,
  fontFamily:
    "'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif",
  color: "#172b4d",
  letterSpacing: "-0.2px",
  textTransform: "none",
  "&.MuiButtonBase-root": {
    display: "flex",
    flexDirection: "row",
    justifyItems: "center",
    justifyContent: "flex-start",
    minWidth: "80px",
    padding: "10px 10px",
  },
  "&.Mui-selected": {
    color: "#682A7D",
  },
  "&.MuiTab-textColorPrimary": {
    display: "flex",
    justifyContent: "flex-start",
    textAlign: "center",
  },
}));
