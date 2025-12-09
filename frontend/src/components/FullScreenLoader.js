// frontend/src/components/FullScreenLoader.js
import React from "react";
import "./FullScreenLoader.css";

const FullScreenLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fs-loader-backdrop">
      <div className="fs-loader-card">
        <div className="fs-loader-spinner" />
        <p className="fs-loader-text">{message}</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
