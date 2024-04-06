import React from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";

export default function CsvButton({ fileTitle, downloadData }) {
  return (
    <CSVLink
      filename={`${fileTitle}.csv`}
      data={downloadData[0] ? downloadData[0] : []}
    >
      <button className="btn btn-solid ml-5">다운로드</button>
    </CSVLink>
  );
}

CsvButton.propTypes = {
  fileTitle: PropTypes.any,
  downloadData: PropTypes.any,
};
