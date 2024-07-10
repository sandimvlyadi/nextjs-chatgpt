import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <Link href="/text-generation" className="btn btn-outline md:min-w-64">
        Text Generation
      </Link>
      <Link href="/image-generation" className="btn btn-outline md:min-w-64">
        Image Generation
      </Link>
      <Link href="/text-to-speech" className="btn btn-outline md:min-w-64">
        Text to Speech
      </Link>
      <Link href="/text-generation-custom" className="btn btn-outline md:min-w-64">
        Text Generation Custom (Harfu's School)
      </Link>
    </main>
  );
}
