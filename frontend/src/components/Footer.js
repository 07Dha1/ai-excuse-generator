// frontend/src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>
        © {new Date().getFullYear()} AI Excuse Generator. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
