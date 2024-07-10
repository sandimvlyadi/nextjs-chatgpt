import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text to Speech",
  description: "Convert text to speech using OpenAI's API",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
