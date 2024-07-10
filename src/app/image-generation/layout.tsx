import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Generation",
  description: "Generate images from text prompts",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
