import React from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";
import { Dialog, Tab, Tabs, Box } from "@mui/material";
import { DeleteID, ExcelData } from "./ExcelClass";
import { styled } from "@mui/material/styles";

const STYLE = {
  fontSize: "14px",
  lineHeight: 1.5,
  fontFamily:
    "'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif",
  fontWeight: 400,
  color: "#172b4d",
  letterSpacing: "-0.2px",
};

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

export function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export function List({ field, valueIndex, changeCheckBox, changeCheck }) {
  return (
    <li className="mn-item">
      <a className="mn-link">
        <span className="mn-name">
          <label className="label-checkbox mr-10 ">
            <input
              type="checkbox"
              checked={changeCheckBox[valueIndex]?.includes(field)}
              onChange={(e) => changeCheck(e.target.checked, field, valueIndex)}
            />
            <span className="mark"></span>
            <span className="text">{field}</span>
          </label>
        </span>
      </a>
    </li>
  );
}
List.propTypes = {
  field: PropTypes.string,
  valueIndex: PropTypes.number,
  changeCheckBox: PropTypes.array,
  changeCheck: PropTypes.func,
};

export function XlsxComponent({ buttonComponent, fileName, data, sheetName }) {
  const [open, setOpen] = React.useState(false);
  const [fileTitle, setFileTitle] = React.useState(fileName);
  const [originalData, setOriginalData] = React.useState(data);
  const [downloadData, setDownloadData] = React.useState(data);
  const [originalCheckBox, setOriginalCheckBox] = React.useState([[]]);
  const [changeCheckBox, setChangeCheckBox] = React.useState([[]]);
  const [allCheckBox, setAllCheckBox] = React.useState(true);
  const [value, setValue] = React.useState(0);
  const [sheetArry] = React.useState(sheetName);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const tabhandleChange = (event, newValue) => {
    setValue(newValue); //tab 위치 변경
  };

  const ChangeCheck = (checked, field, valueIndex) => {
    const reuslt = changeCheckBox.map((v, i) => {
      if (i == valueIndex && checked) return v.concat(field);
      else if (i == valueIndex && !checked) return v?.filter((o) => o != field);
      else return v;
    });
    setChangeCheckBox(reuslt);
  };

  React.useEffect(() => {
    if (open) {
      setValue(0);
      setAllCheckBox(true);
      setFileTitle(fileName);

      const result = new DeleteID(data).getArray(); //object id key 제거
      setOriginalData(result);
      setDownloadData(result);

      const header = new ExcelData(result).getHeader(); //필드 이름
      setOriginalCheckBox(header);
      setChangeCheckBox(header);
    }
  }, [open]);

  React.useEffect(() => {
    // const result = new ExcelData(originalData).getData(changeCheckBox[value], 0);
    const result = new ExcelData(originalData).getData(changeCheckBox);
    setDownloadData(result);
  }, [changeCheckBox, value]);

  React.useEffect(() => {
    if (allCheckBox) {
      setChangeCheckBox(originalCheckBox);
    } else if (!allCheckBox) {
      const result = originalCheckBox?.map(() => {
        return [];
      });
      setChangeCheckBox(result);
    }
  }, [allCheckBox]);

  const Download = (fileName, downloadData, sheetName) => {
    // const result = row.map((o) => {
    //   const noneid = o.map((v) => {
    //     const obj = { ...v };
    //     delete obj.id;
    //     return obj;
    //   });
    //   return noneid;
    // });

    let sheetsData = {};
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    for (let i = 0; i < downloadData.length; i++) {
      const wss = XLSX.utils.json_to_sheet(downloadData[i]);
      sheetsData[sheetName[i]] = wss;
    }

    let wb = {
      Sheets: sheetsData,
      SheetNames: sheetName,
    };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, `${fileName}${fileExtension}`);
  };

  return (
    <>
      <a onClick={handleClickOpen}>{buttonComponent}</a>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ backgroundColor: "transparent" }}
      >
        <div id="excelDownload" className="modal" style={{ display: "block" }}>
          <div className="modal-flex">
            <div className="modal-flex-inner" style={STYLE}>
              <div className="modal-header">
                <div className="dp-flex">
                  <div className="mr-auto">
                    <h6 className="title">항목 관리</h6>
                  </div>
                  <div className="ml-auto">
                    <button className="btn btn-icon" onClick={handleClose}>
                      <i className="icon-close"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="modal-content"
                style={{ maxWidth: "900px", width: "100%" }}
              >
                <p className="ft-darkgray mb-5">파일명</p>
                <input
                  type="text"
                  className="form-control form-md w-100"
                  value={fileTitle}
                  onChange={(v) => setFileTitle(v.target.value)}
                />
                <div className="space-20"></div>
                <p className="ft-darkgray mb-5" style={{ margin: 0 }}>
                  다운로드 항목
                </p>
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
                  {sheetArry.map((item, index) => (
                    <CustomTab
                      key={index}
                      disableRipple
                      label={item}
                      {...a11yProps(index)}
                    />
                  ))}
                </Tabs>

                <div
                  className="bdr bdr-all bdr-gray"
                  style={{ height: "250px", overflow: "auto" }}
                >
                  <ul className="tree-view mt-10 mb-10">
                    {originalCheckBox[value].map((v, i) => (
                      <List
                        key={i}
                        valueIndex={value}
                        field={v}
                        changeCheckBox={changeCheckBox}
                        changeCheck={ChangeCheck}
                      />
                    ))}
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <div className="dp-flex">
                  <div className="mr-auto">
                    <label className="label-checkbox mr-10">
                      <input
                        type="checkbox"
                        checked={allCheckBox}
                        onChange={(e) => setAllCheckBox(e.target.checked)}
                      />
                      <span className="mark"></span>
                      <span className="text">항목 전체선택</span>
                    </label>
                  </div>
                  <div className="ml-auto">
                    <button className="btn btn-outline" onClick={handleClose}>
                      취소
                    </button>
                    <button
                      className="btn btn-solid"
                      style={{ marginLeft: 5 }}
                      onClick={() =>
                        Download(fileTitle, downloadData, sheetName)
                      }
                    >
                      다운로드
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
XlsxComponent.propTypes = {
  buttonComponent: PropTypes.element,
  fileName: PropTypes.string,
  data: PropTypes.array,
  sheetName: PropTypes.array,
};

export function CsvComponent({ buttonComponent, fileName, data }) {
  const [open, setOpen] = React.useState(false);
  const [fileTitle, setFileTitle] = React.useState(fileName);
  const [originalData, setOriginalData] = React.useState(data);
  const [downloadData, setDownloadData] = React.useState(data);
  const [originalCheckBox, setOriginalCheckBox] = React.useState([[]]);
  const [changeCheckBox, setChangeCheckBox] = React.useState([[]]);
  const [allCheckBox, setAllCheckBox] = React.useState(true);
  const [value, setValue] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const ChangeCheck = (checked, field, valueIndex) => {
    const reuslt = changeCheckBox.map((v, i) => {
      if (i == valueIndex && checked) return v.concat(field);
      else if (i == valueIndex && !checked) return v?.filter((o) => o != field);
      else return v;
    });
    setChangeCheckBox(reuslt);
  };

  React.useEffect(() => {
    if (open) {
      setValue(0);
      setAllCheckBox(true);
      setFileTitle(fileName);

      const result = new DeleteID(data).getArray(); //object id key 제거
      setOriginalData(result);
      setDownloadData(result);

      const header = new ExcelData(result).getHeader(); //필드 이름
      setOriginalCheckBox(header);
      setChangeCheckBox(header);
    }
  }, [open]);

  React.useEffect(() => {
    // const result = new ExcelData(originalData).getData(changeCheckBox[value], 0);
    const result = new ExcelData(originalData).getData(changeCheckBox);
    setDownloadData(result);
  }, [changeCheckBox, value]);

  React.useEffect(() => {
    if (allCheckBox) {
      setChangeCheckBox(originalCheckBox);
    } else if (!allCheckBox) {
      const result = originalCheckBox?.map(() => {
        return [];
      });
      setChangeCheckBox(result);
    }
  }, [allCheckBox]);

  return (
    <>
      <a onClick={handleClickOpen}>{buttonComponent}</a>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ backgroundColor: "transparent" }}
      >
        <div id="excelDownload" className="modal" style={{ display: "block" }}>
          <div className="modal-flex">
            <div className="modal-flex-inner" style={STYLE}>
              <div className="modal-header">
                <div className="dp-flex">
                  <div className="mr-auto">
                    <h6 className="title">항목 관리</h6>
                  </div>
                  <div className="ml-auto">
                    <button className="btn btn-icon" onClick={handleClose}>
                      <i className="icon-close"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="modal-content"
                style={{ maxWidth: "900px", width: "100%" }}
              >
                <p className="ft-darkgray mb-5">파일명</p>
                <input
                  type="text"
                  className="form-control form-md w-100"
                  value={fileTitle}
                  onChange={(v) => setFileTitle(v.target.value)}
                />
                <div className="space-20"></div>
                <p className="ft-darkgray mb-5">다운로드 항목</p>
                <div
                  className="bdr bdr-all bdr-gray"
                  style={{ height: "250px", overflow: "auto" }}
                >
                  <ul className="tree-view mt-10 mb-10">
                    {originalCheckBox[value].map((v, i) => (
                      <List
                        key={i}
                        valueIndex={value}
                        field={v}
                        changeCheckBox={changeCheckBox}
                        changeCheck={ChangeCheck}
                      />
                    ))}
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <div className="dp-flex">
                  <div className="mr-auto">
                    <label className="label-checkbox mr-10">
                      <input
                        type="checkbox"
                        checked={allCheckBox}
                        onChange={(e) => setAllCheckBox(e.target.checked)}
                      />
                      <span className="mark"></span>
                      <span className="text">항목 전체선택</span>
                    </label>
                  </div>
                  <div className="ml-auto">
                    <button className="btn btn-outline" onClick={handleClose}>
                      취소
                    </button>
                    {/* <button
                      className="btn btn-solid"
                      style={{ marginLeft: 5 }}
                      onClick={() =>
                        Download(fileTitle, downloadData, sheetName)
                      }
                    >
                      다운로드
                    </button> */}

                    <CSVLink
                      filename={`${fileTitle}.csv`}
                      data={downloadData[0] ? downloadData[0] : []}
                      // data={downloadData[0]}
                    >
                      <button
                        className="btn btn-solid"
                        style={{ marginLeft: 5 }}
                      >
                        다운로드
                      </button>
                    </CSVLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
CsvComponent.propTypes = {
  buttonComponent: PropTypes.element,
  fileName: PropTypes.string,
  data: PropTypes.array,
};

export function ButtonComponent() {
  return (
    <div className="btn btn-outline" style={{ marginLeft: 5 }}>
      <i className="icon-file-download"></i>
      다운로드
    </div>
  );
}

/**
 * @todo data의 길이가 1개 초과일 경우 xlsx 형식, 1개 이하일 경우 csv 형식
 * @param {element} xlsx xlsx 형식인 경우의 버튼 컴포넌트
 * @example <span className="btn btn-outline"> Export as Xlsx</span>
 * @param {element} csv csv 형식인 경우의 버튼 컴포넌트
 * @example <span className="btn btn-outline"> Export as CSV</span>
 * @param {string} fileName 다운받는 파일 이름
 * @example fileName={"파일이름"}
 * @param {array} data 객체 형식의 이중 배열
 * @example data={ [ [{ 필드이름 : "table1", 값 : 1 },{ 필드이름 : "table2", 값 : 2 }], [], [] ] }
 * @param {array} sheetName 문자열 형식의 배열 (xlsx일 경우에만 필수, data와 sheetName의 길이는 동일해야함 또는 적거나)
 * @example sheetName={ ["시트1", "시트2", "시트3"] }
 */
export default function Excel({ xlsx, csv, fileName, data, sheetName }) {
  if (data?.length > 1)
    return (
      <XlsxComponent
        buttonComponent={xlsx ?? <ButtonComponent />}
        fileName={fileName}
        data={data}
        sheetName={sheetName}
      />
    );
  else if (data?.length == 1)
    return (
      <CsvComponent
        buttonComponent={csv ?? <ButtonComponent />}
        fileName={fileName}
        data={data}
      />
    );
}

Excel.propTypes = {
  xlsx: PropTypes.element,
  csv: PropTypes.element,
  fileName: PropTypes.string,
  data: PropTypes.array,
  sheetName: PropTypes.array,
};
