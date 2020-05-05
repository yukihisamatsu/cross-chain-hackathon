import "antd/dist/antd.css";

import React from "react";
import ReactDOM from "react-dom";

import {Root} from "./pages/root";

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<Root />, document.getElementById("root"));
});
