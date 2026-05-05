export const metadata = {
  title: "SwitchMyUtilities — Hassle-free utility transfers",
  description: "We handle your utility transfers at closing so you don't have to. Flat fee, done in days.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
