"use client";

import SideBar from "@/components/SideBar";
import { useEffect, useState } from "react";
import { FaDeleteLeft, FaPlus } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";

export default function LentedBook() {
  type Book = {
    book_id: number;
    borrower_name: string;
    academic_year: string;
    lend_date: string;
    return_date: string;
  };

  const [lendedBooks, setLendedBooks] = useState<Book[]>([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState<string>("year");

  useEffect(() => {
    //fetch all lended Books from database
    const fetchCourseBooks = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/books/lended-books");

        if (res.status === 204) {
          console.log("No Books Found");
          setLendedBooks([]);
          return;
        }

        const data = await res.json();

        data.lendedBooks
          ? setLendedBooks(data.lendedBooks)
          : setLendedBooks(data.lendedBooks || []);
      } catch (err) {
        console.log("Error in fetching data", err);
      }
    };

    fetchCourseBooks();
  }, []);

  //Refresh displayed book
  const refreshBooks = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/books/lended-books"
      );
      const data = await response.json();
      if (data.lendedBooks) setLendedBooks(data.lendedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const filterBooks = lendedBooks.filter((book) => {
    if (selectedYear === "year") return true;
    return book.academic_year === selectedYear;
  });

  const displayedBooks = selectedYear === "year" ? lendedBooks : filterBooks;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = displayedBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayedBooks.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  function handleDelete(book_id: number): void {
    throw new Error("Function not implemented.");
  }

  //Format date
  function formatDate(dateString: string) {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return (
    <div className="flex">
      <SideBar logoUrl="../svg/library.svg" />
      <div className="w-[80%] py-6 px-12 space-y-10">
        <div className="flex items-center justify-between w-full sticky top-0 bg-white pb-10 pt-4">
          <input
            type="search"
            placeholder="Search..."
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <IoMdNotificationsOutline
            size={30}
            className="text-gray-400 cursor-pointer"
            title="Notifications"
          />
        </div>
        <div>
          <div className="flex items-center justify-between pb-6">
            <p className="text-xl text-indigo-900">Lended Books</p>
            <select
              name="year"
              id="year"
              className="outline-none border-2 border-indigo-900 rounded-lg px-6 py-2 cursor-pointer"
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="year">Select Year</option>
              <option value="s1">S1</option>
              <option value="s2">S2</option>
              <option value="s3">S3</option>
              <option value="s4">S4</option>
              <option value="s5">S5</option>
              <option value="s6">S6</option>
            </select>
          </div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Book Id
                </th>
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Borrower Name
                </th>
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Academic Year
                </th>
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Lend Date
                </th>
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Return Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.length > 0 ? (
                currentBooks.map((book, index) => (
                  <tr key={index} className="text-center hover:bg-gray-100">
                    <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                      {book.book_id}
                    </td>
                    <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                      {book.borrower_name}
                    </td>
                    <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                      {book.academic_year}
                    </td>
                    <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                      {formatDate(book.lend_date)}
                    </td>
                    <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                      {book.return_date
                        ? formatDate(book.return_date)
                        : "Not returned"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center hover:bg-gray-100">
                  <td
                    colSpan={5}
                    className="border border-indigo-900 text-red-600 px-4 py-12 text-2xl"
                  >
                    No Books Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 border border-indigo-900 hover:bg-indigo-900 hover:text-white duration-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 border rounded ${
                    currentPage === i + 1
                      ? "bg-indigo-900 text-white"
                      : "bg-white text-indigo-900 border-indigo-900 hover:bg-indigo-900 hover:text-white duration-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed border-indigo-900 hover:bg-indigo-900 hover:text-white duration-500"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
