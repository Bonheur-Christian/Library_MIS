"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  interface User {
    username: string;
    email: string;
    password: string;
  }

  const [formData, setFormData] = useState<User>({
    username: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Registration failed.");
        return;
      }

      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
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

        <form
          onSubmit={handleRegister}
          className="space-y-10 flex flex-col w-[60%] justify-center mx-auto"
        >
          <input
            required
            type="text"
            name="username"
            placeholder="Enter username"
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <input
            required
            type="email"
            placeholder="Enter email"
            name="email"
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            required
            type="password"
            placeholder="Enter password"
            name="password"
            className="outline-2 outline-gray-200 bg-gray-100 py-4 px-6 rounded-lg text-gray-700"
            value={formData.password}
            onChange={handleChange}
          />

          {errorMessage && (
            <p className="text-red-600 text-center">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="text-green-600 text-center">{successMessage}</p>
          )}

          <button className="text-white text-xl bg-indigo-900 hover:bg-blue-800 duration-500 font-medium w-1/2 justify-center mx-auto py-6 rounded-xl">
            Register
          </button>
        </form>

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
