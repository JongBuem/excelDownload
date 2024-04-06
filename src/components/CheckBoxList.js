import React from "react";
import PropTypes from "prop-types";

export default function CheckBoxList({
  field,
  valueIndex,
  changeCheckBox,
  changeCheck,
}) {
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

CheckBoxList.propTypes = {
  field: PropTypes.string,
  valueIndex: PropTypes.number,
  changeCheckBox: PropTypes.array,
  changeCheck: PropTypes.func,
};
