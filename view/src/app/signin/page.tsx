"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Login failed. Please try again.");
        return;
      }

      // Redirect to dashboard or library page
      router.push("/library"); // adjust as needed
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex">
      <div className="w-[40%] bg-indigo-900 h-screen">
        <h1 className="text-4xl font-medium text-white text-center w-[80%] pt-[25rem] mx-auto leading-relaxed">
          Welcome Back To Library Management System!
        </h1>
      </div>

      <div className="w-[60%] px-32 pt-40 space-y-12">
        <h1 className="text-4xl font-medium text-center">Log Into Your Account</h1>

        <div className="space-y-8 flex flex-col w-[60%] justify-center mx-auto">
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
          />
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
          />

          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          <button
            onClick={handleLogin}
            className="text-white text-xl bg-indigo-900 hover:bg-blue-800 duration-500 font-medium w-1/2 justify-center mx-auto py-6 rounded-xl"
          >
            Login
          </button>
        </div>

        <p className="text-xl text-center pt-20">
          Don’t have an account?{" "}
          <a href="/" className="text-blue-500 hover:underline duration-500">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
