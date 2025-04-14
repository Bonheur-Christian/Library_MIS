import { useState } from "react";
import { toast } from "react-toastify";

interface LendModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onBookLent: () => void;
  book_id: string; // ✅ changed to string for MongoDB ObjectId
}

interface FormData {
  borrower_name: string;
  academic_year: string;
  book_code:string;
}

const LendBookModal: React.FC<LendModalProps> = ({
  isOpen,
  onClose,
  title,
  onBookLent,
  book_id,
}) => {
  const [formData, setFormData] = useState<FormData>({
    borrower_name: "",
    academic_year: "",
    book_code:"",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/books/lend-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book_id, ...formData }),
      });

      if (response.ok) {
        toast.success(
          `${formData.borrower_name} in ${formData.academic_year} is given book`,
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          }
        );

        setFormData({
          borrower_name: "",
          academic_year: "",
          book_code:"",
        });

        onBookLent();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error?.messageError || "Book not lended", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch {
      toast.error("Something went wrong! Please try again", {
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
            className="text-gray-600 hover:text-red-500 text-xl cursor-pointer"
            title="Close"
          >
            ❎
          </button>
        </div>

        <div className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <label className="block text-gray-600 font-semibold">Book ID</label>
              <input
                readOnly
                value={book_id}
                name="book_id"
                type="text" // ✅ changed from number to text for ObjectId
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">
                Borrower Name
              </label>
              <input
                value={formData.borrower_name}
                onChange={handleChange}
                name="borrower_name"
                placeholder="Enter Borrower Name"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-gray-600 font-semibold">
                Academic Year
              </label>
              <input
                value={formData.academic_year}
                onChange={handleChange}
                name="academic_year"
                placeholder="Enter Academic Year"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-gray-600 font-semibold">
                Book Code
              </label>
              <input
                value={formData.book_code}
                onChange={handleChange}
                name="book_code"
                placeholder="Enter Book Code"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Lend Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LendBookModal;
