export default function Home() {
  return (
    <div className="flex">
      <div className="w-[40%] bg-indigo-900 h-screen">
        <h1 className="text-4xl font-medium text-white text-center w-[80%] pt-[25rem] mx-auto">
          Welcome To Library Management System!
        </h1>
      </div>

      <div className="w-[60%] px-32 pt-32 space-y-12 ">
        <h1 className="text-4xl font-medium text-center">Create Account</h1>
        <div className="space-y-12 flex flex-col w-[60%] justify-center mx-auto">
          <input
            type="text"
            name="username"
            placeholder="enter username"
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
            autoFocus
          />
          <input
            type="email"
            placeholder="enter email"
            name="email"
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
          />
          <input
            type="text"
            placeholder="enter password"
            name="password"
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
          />

          <button className="text-white text-xl bg-indigo-900 hover:bg-blue-800  duration-500 font-medium w-1/2 justify-center mx-auto py-6 rounded-xl ">
            Register
          </button>
        </div>

        <p className="text-xl text-center pt-20">
          already have an account{" "}
          <a
            href="/signin"
            className="text-blue-500 hover:underline duration-500"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
