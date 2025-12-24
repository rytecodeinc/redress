"use client";

export function RedressFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>© {year} Redress</div>
        <div className="footer-links">
          <a href="#">Help</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}

