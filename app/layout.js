import "./globals.css";

export const metadata = {
  title: "Redress",
  description: "Digital closet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="redress-app">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

