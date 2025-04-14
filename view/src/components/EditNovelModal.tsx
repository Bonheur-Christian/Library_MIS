"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onBookEdited: () => void;
  book_id: string;
}

interface FormData {
  book_type: string;
  book_name: string;
  published_year: number;
  quantity: number;
  book_author: string;
}

const EditNovalModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  onBookEdited,
  book_id,
}) => {
  const [formData, setFormData] = useState<FormData>({
    book_type: "course",
    book_name: "",
    published_year: 0,
    quantity: 0,
    book_author: "",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const handleFetchBook = async () => {
      try {
        const res = await fetch(`${API_URL}/api/books/${book_id}`);
        const data = await res.json();
        if (data.book) {
          setFormData(data.book);
        }
      } catch {
        console.log("Error occurred while fetching book data");
      }
    };

    if (isOpen) {
      handleFetchBook();
    }
  }, [API_URL, book_id, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/books/update-book/${book_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success(`${formData.book_name} Info Is Updated`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        setFormData({
          book_type: "novel",
          book_name: "",
          published_year: 0,
          quantity: 0,
          book_author: "",
        });

        onBookEdited();
        onClose();
      } else {
        toast.error("Book Info Not Changed", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch {
      toast.error("Something went wrong! Please Try Again", {
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
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[rgba(0,0,0,0.4)] z-50">
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
              <label className="block text-gray-600 font-semibold">Book Type</label>
              <input
                required
                readOnly
                value={formData.book_type}
                name="book_type"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">Book Name</label>
              <input
                required
                value={formData.book_name}
                placeholder="Enter Book Name"
                onChange={handleChange}
                name="book_name"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

             

              <label className="block text-gray-600 font-semibold">Published Year</label>
              <input
                required
                name="published_year"
                value={formData.published_year}
                onChange={handleChange}
                placeholder="Enter Published Year"
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">Quantity</label>
              <input
                required
                name="quantity"
                value={formData.quantity}
                placeholder="Enter quantity"
                onChange={handleChange}
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">Author</label>
              <input
                required
                value={formData.book_author}
                onChange={handleChange}
                placeholder="Enter book author"
                name="book_author"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Update Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNovalModal;
