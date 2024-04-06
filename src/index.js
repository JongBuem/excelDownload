import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components";
import "./assets/style.css";
import "./assets/index.css";
import "./assets/common.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App
      fileName={"RRR"}
      data={[
        [
          { 필드이름: "table1", 값: 1 },
          { 필드이름: "table2", 값: 2 },
        ],
        [
          { 값: "table1", 이름: 1 },
          { 값: "table2", 이름: 2 },
        ],
      ]}
      sheetName={[1, 2]}
    />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
