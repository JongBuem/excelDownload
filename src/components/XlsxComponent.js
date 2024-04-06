import React from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DeleteID, ExcelData } from "./class";
import { Dialog, Tabs } from "@mui/material";
import { a11yProps, CustomTab } from "./Tab";
import CheckBoxList from "./CheckBoxList";

export default function XlsxComponent({
  buttonComponent,
  fileName,
  data,
  sheetName,
}) {
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
    const sheet = sheetName.map((value) => value.toString());
    let sheetsData = {};
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    for (let i = 0; i < downloadData.length; i++) {
      const wss = XLSX.utils.json_to_sheet(downloadData[i]);
      sheetsData[sheet[i]] = wss;
    }

    let wb = {
      Sheets: sheetsData,
      SheetNames: sheet,
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
            <div className="modal-flex-inner">
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
                      <CheckBoxList
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
