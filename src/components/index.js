import React from "react";
import PropTypes from "prop-types";
import ButtonComponent from "./ButtonComponent";
import Excel from "./Excel";

/**
 * @todo data의 길이가 1개 초과일 경우 xlsx 형식, 1개 이하일 경우 csv 형식
 * @param {element} buttonComponent 버튼 컴포넌트
 * @example <span className="btn btn-outline"> Export as CSV</span>
 * @param {string} fileName 다운받는 파일 이름
 * @example fileName={"파일이름"}
 * @param {array} data 객체 형식의 이중 배열
 * @example data={ [ [{ 필드이름 : "table1", 값 : 1 },{ 필드이름 : "table2", 값 : 2 }], [], [] ] }
 * @param {array} sheetName 문자열 형식의 배열 (xlsx일 경우에만 필수, data와 sheetName의 길이는 동일해야함 또는 적거나 *문자열로만)
 * @example sheetName={ ["시트1", "시트2", "시트3"] }
 */
export default function App({ buttonComponent, fileName, data, sheetName }) {
  if (data?.length > 0)
    return (
      <Excel
        buttonComponent={buttonComponent ?? <ButtonComponent />}
        fileName={fileName}
        data={data}
        sheetName={sheetName}
        xlsx={data?.length > 1}
      />
    );
  else return buttonComponent ?? <ButtonComponent />;
}

Excel.propTypes = {
  xlsx: PropTypes.element,
  csv: PropTypes.element,
  fileName: PropTypes.string,
  data: PropTypes.array,
  sheetName: PropTypes.array,
};
