import React from "react";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { saveAs } from "file-saver";

export default function XlsxButton({ fileTitle, downloadData, sheetName }) {
  //XLSX파일 형식 다운로드
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
    <button
      className="btn btn-solid ml-5"
      onClick={() => Download(fileTitle, downloadData, sheetName)}
    >
      다운로드
    </button>
  );
}

XlsxButton.propTypes = {
  fileTitle: PropTypes.any,
  downloadData: PropTypes.any,
  sheetName: PropTypes.any,
};
