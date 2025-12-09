// frontend/src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <p className="footer-title">
        🧠 AI Excuse Generator &nbsp;•&nbsp; Smart excuses, professional outputs.
      </p>

      <div className="footer-links">
        {/* GitHub Repo */}
        <a
          href="https://github.com/07Dha1/ai-excuse-generator"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Source on GitHub
        </a>

        {/* Portfolio or LinkedIn – update URL to your own */}
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect on LinkedIn
        </a>

        {/* Contact / Email – update to your actual email or contact page */}
        <a href="mailto:you@example.com">
          Contact Support
        </a>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} AI Excuse Generator. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
