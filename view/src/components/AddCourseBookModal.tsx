"use client";

import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onBookAdded: () => void;  

}

const AddCourseBookModal: React.FC<ModalProps> = ({ isOpen, onClose, title, onBookAdded }) => {
  if (!isOpen) return null;

  interface FormData {
    bookname: string;
    subject: string;
    academic_year: string;
    isbn: string;
    published_year: number;
    quantity: number;
  }

  const [formData, setFormData] = useState<FormData>({
    bookname: "",
    subject: "",
    academic_year: "",
    isbn: "",
    published_year: 0,
    quantity: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(formData);

    try {
      const response = await fetch(
        "http://localhost:3001/api/course-books/add-book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        console.log("Book added successfully:", data);

        setFormData({
          bookname: "",
          subject: "",
          academic_year: "",
          isbn: "",
          published_year: 0,
          quantity: 0,
        });

        onBookAdded();

        onClose();
      } else {
        console.error("Error adding book:", response.statusText);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
                Book Name
              </label>
              <input
                value={formData.bookname}
                placeholder="Enter bookname"
                onChange={handleChange}
                name="bookname"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">
                Subject
              </label>
              <input
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
                value={formData.academic_year}
                onChange={handleChange}
                placeholder="Enter academic year"
                name="academic_year"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">ISBN</label>
              <input
                name="isbn"
                onChange={handleChange}
                value={formData.isbn}
                placeholder="Enter book isbn"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">
                Published Year
              </label>
              <input
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
                name="quantity"
                placeholder="Enter quantity"
                onChange={handleChange}
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
