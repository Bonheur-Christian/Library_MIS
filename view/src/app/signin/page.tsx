"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function Signin() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      router.push("/library");
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // this is crucial for sending/receiving cookies
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("Response:", data);

      if (!res.ok) {
        setErrorMessage(data.messageError || "Login failed. Please try again.");
        return;
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/library");
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
      console.error("Login error:", err);
    }
  };

  //password show and hide toggling
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex">
      <div className="w-[40%] bg-indigo-900 h-screen">
        <h1 className="text-4xl font-medium text-white text-center w-[80%] pt-[25rem] mx-auto leading-relaxed">
          Welcome Back To Library Management System!
        </h1>
      </div>

      <div className="w-[60%] px-32 pt-40 space-y-12">
        <h1 className="text-4xl font-medium text-center">
          Log Into Your Account
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-8 flex flex-col w-[60%] justify-center mx-auto"
        >
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
          />
          <div className="flex items-center ">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700 w-full"
            />
            <p
              onClick={handleShowPassword}
              className="ml-[-2vw] text-gray-700 hover:text-indigo-900 duration-300"
            >
              {showPassword ? (
                <FaRegEye size={30} />
              ) : (
                <FaRegEyeSlash size={30} />
              )}
            </p>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          <button className="text-white text-xl bg-indigo-900 hover:bg-blue-800 duration-500 font-medium w-1/2 justify-center mx-auto py-6 rounded-xl">
            Login
          </button>
        </form>

        <p className="text-xl text-center pt-20">
          Don’t have an account?{" "}
          <Link href="/" className="text-blue-500 hover:underline duration-500">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
