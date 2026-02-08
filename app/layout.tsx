import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Rate-My-Hack \u2013 Hackathon Project Predictor",
  description:
    "Paste your Devpost project and get an honest hackathon verdict powered by AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
