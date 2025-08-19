import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import StarRating from "./components/StarRating/StarRating.component";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
      defaultRating={3}
    />
    <App />
  </React.StrictMode>
);
