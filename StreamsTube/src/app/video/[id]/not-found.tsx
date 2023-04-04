import Link from "next/link";

export const metadata = {
  title: "Video not found",
};

export default function NotFound() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">
          The video you&apos;re looking for could not be found.
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          Go back to home page
        </Link>
      </div>
    </>
  );
}
