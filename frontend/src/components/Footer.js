import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h2>🧠 AI Excuse Generator</h2>
        <p className="tagline">Smart excuses powered by AI — built for fun, innovation & real-world automation 🔥</p>
      </div>

      <div className="footer-center">
        <p className="built-with">🔧 Built with</p>
        <div className="tech-stack">
          <span>React ⚛️</span>
          <span>Node.js 🟢</span>
          <span>Express 🚀</span>
          <span>MongoDB 🍃</span>
        </div>
      </div>

      <div className="footer-right">
        <p className="connect-title">🌐 Connect</p>
        <div className="social-links">
          <a href="https://github.com/07Dha1" target="_blank">GitHub</a>
          <a href="https://www.linkedin.com/in/sai-dhawan-80a22321a/" target="_blank">LinkedIn</a>
          <a href="#" target="_blank">Portfolio</a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} AI Excuse Generator — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
