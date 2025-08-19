export const metadata = {
  title: "VC System",
  description: "Issuer–Holder–Verifier–Registry demo",
};

import "./globals.css";
import Nav from "../components/Nav";

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <Nav />
        <main className="container">{children}</main>
        <footer className="footer">© {new Date().getFullYear()} VC Demo</footer>
      </body>
    </html>
  );
}
