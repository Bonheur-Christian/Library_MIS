"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Registration failed.");
        return;
      }

      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex">
      <div className="w-[40%] bg-indigo-900 h-screen">
        <h1 className="text-4xl font-medium text-white text-center w-[80%] pt-[25rem] mx-auto">
          Welcome To Library Management System!
        </h1>
      </div>

      <div className="w-[60%] px-32 pt-32 space-y-12">
        <h1 className="text-4xl font-medium text-center">Create Account</h1>

        <div className="space-y-10 flex flex-col w-[60%] justify-center mx-auto">
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && (
            <p className="text-red-600 text-center">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="text-green-600 text-center">{successMessage}</p>
          )}

          <button
            onClick={handleRegister}
            className="text-white text-xl bg-indigo-900 hover:bg-blue-800 duration-500 font-medium w-1/2 justify-center mx-auto py-6 rounded-xl"
          >
            Register
          </button>
        </div>

        <p className="text-xl text-center pt-20">
          Already have an account?{" "}
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
