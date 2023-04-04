import "./globals.css";
import { ReactNode } from "react";

import { NavBar } from "src/components/Navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          <NavBar />
          <div className="px-4 py-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
