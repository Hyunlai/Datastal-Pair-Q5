import React from "react";
import ReactDOM from "react-dom/client";

import "./bootstrap.min.css";

import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { store } from "./redux/store";
import router from "./router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);