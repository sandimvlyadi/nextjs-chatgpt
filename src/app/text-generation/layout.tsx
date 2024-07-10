import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Generation",
  description: "Text Generation using OpenAI's GPT-4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
