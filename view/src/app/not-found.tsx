import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-200">
      <h1 className="text-4xl font-bold mb-4 text-red-500">⚠️ 404 - Page Not Found</h1>
      <p className="mb-8 text-xl ">
        Sorry, We Couldn't Find The Page You Are Looking For.
      </p>
      <p>Go Back To The <Link href="/library" className="text-xl text-indigo-900 font-bold hover:underline duration-300">Library</Link> </p>
    </div>
  );
}
