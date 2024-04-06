import React from "react";
import PropTypes from "prop-types";
import { Dialog } from "@mui/material";
import { DeleteID, ExcelData } from "./class";
import CheckBoxList from "./CheckBoxList";
import XlsxButton from "./XlsxButton";
import CsvButton from "./CsvButton";
import XlsxTab from "./XlsxTab";

export default function Excel({
  buttonComponent,
  fileName,
  data,
  sheetName,
  xlsx,
}) {
  const [open, setOpen] = React.useState(false);
  const [fileTitle, setFileTitle] = React.useState(fileName);
  const [originalData, setOriginalData] = React.useState(data);
  const [downloadData, setDownloadData] = React.useState(data);
  const [originalCheckBox, setOriginalCheckBox] = React.useState([[]]);
  const [changeCheckBox, setChangeCheckBox] = React.useState([[]]);
  const [allCheckBox, setAllCheckBox] = React.useState(true);
  const [value, setValue] = React.useState(0);

  //modal 열기
  const handleClickOpen = () => {
    setOpen(true);
  };

  //modal 닫기
  const handleClose = () => {
    setOpen(false);
  };

  //다운로드 항목 관리
  const ChangeCheck = (checked, field, checkedIndex) => {
    const reuslt = changeCheckBox.map((value, index) => {
      if (index === checkedIndex && checked) return value.concat(field);
      else if (index === checkedIndex && !checked)
        return value?.filter((prev) => prev !== field);
      else return value;
    });
    setChangeCheckBox(reuslt);
  };

  //항목 변경시 동작
  React.useEffect(() => {
    const result = new ExcelData(originalData).getData(changeCheckBox);
    setDownloadData(result); //선택된 항목만 데이터로 추출
  }, [changeCheckBox, value]);

  //항목 전체선택시 동작
  React.useEffect(() => {
    if (allCheckBox) setChangeCheckBox(originalCheckBox);
    else if (!allCheckBox) {
      const result = originalCheckBox?.map(() => {
        return [];
      });
      setChangeCheckBox(result);
    }
  }, [allCheckBox]);

  //모달 오픈시 동작
  React.useEffect(() => {
    if (!open) {
      setValue(0); //tab의 위치를 첫번째로 이동
      setAllCheckBox(true); //항목 전체선택 체크
      setFileTitle(fileName); //파일이름

      const result = new DeleteID(data).getArray(); //object id key 제거
      setOriginalData(result); //id를 제거한 원본 데이터
      setDownloadData(result); //id를 제거한 원본 데이터 (최종 다운로드 되는 데이터)

      const header = new ExcelData(result).getHeader(); //필드 이름
      setOriginalCheckBox(header); //각 Tab의 필드 이름들
      setChangeCheckBox(header); //변경되는 필드 이름들
    }
  }, [open]);

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
                <p className="ft-darkgray mb-5">다운로드 항목</p>

                {xlsx && data?.length === sheetName?.length && (
                  <XlsxTab
                    value={value}
                    sheetName={sheetName}
                    setValue={setValue}
                  />
                )}

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

                    {xlsx && data?.length === sheetName?.length ? (
                      <XlsxButton
                        fileTitle={fileTitle}
                        downloadData={downloadData}
                        sheetName={sheetName}
                      />
                    ) : (
                      <CsvButton
                        fileTitle={fileTitle}
                        downloadData={downloadData}
                      />
                    )}
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
Excel.propTypes = {
  buttonComponent: PropTypes.element,
  fileName: PropTypes.string,
  data: PropTypes.array,
  sheetName: PropTypes.array,
  xlsx: PropTypes.bool,
};
