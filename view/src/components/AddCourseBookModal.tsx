"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onBookAdded: () => void;
}

const AddCourseBookModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  onBookAdded,
}) => {

  interface FormData {
    book_type: string;
    book_name: string;
    published_year: string;
    quantity: number;
    subject: string;
    academic_year: string;
  }

  const [formData, setFormData] = useState<FormData>({
    book_type: "course",
    book_name: "",
    published_year: "",
    quantity: 0,
    subject: "",
    academic_year: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/books/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if(response.status ===400){
        toast.error("Book Already Exists", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        })

        return;
      }

      if (response.ok) {
        toast.success(`${formData.subject} Book is Added To Library`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        setFormData({
          book_type: "course",
          book_name: "",
          published_year: "",
          quantity: 0,
          subject: "",
          academic_year: "",
        });

        onBookAdded();

        onClose();
      } else {
        toast.error("Book Not Added! Try again ", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        })

      }
    } catch (err) {
      console.error("Error adding book:", err);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[rgba(0,0,0,0.4)]  z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center border-b pb-2">
          <h1 className="text-2xl text-gray-600 font-semibold">{title}</h1>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl"
            title="Close"
          >
            ❎
          </button>
        </div>

        <div className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <label className="block text-gray-600 font-semibold">
                Book Type
              </label>
              <input
                required
                readOnly
                value={formData.book_type}
                name="book_type"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-gray-600 font-semibold">
                Book Name
              </label>
              <input
                required
                value={formData.book_name}
                placeholder="Enter Book Name"
                onChange={handleChange}
                name="book_name"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">
                Published Year
              </label>
              <input
                required
                name="published_year"
                onChange={handleChange}
                placeholder="Enter Published year"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">
                Quantity
              </label>
              <input
                required
                name="quantity"
                placeholder="Enter quantity"
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">
                Subject
              </label>
              <input
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter book subject"
                name="subject"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">
                Academic Year
              </label>
              <input
                required
                value={formData.academic_year}
                onChange={handleChange}
                placeholder="Enter academic year"
                name="academic_year"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourseBookModal;
