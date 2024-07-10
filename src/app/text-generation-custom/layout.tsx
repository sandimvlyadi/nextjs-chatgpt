import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Generation Custom (Harfu's School)",
  description: "Generate text from prompts with custom models",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
