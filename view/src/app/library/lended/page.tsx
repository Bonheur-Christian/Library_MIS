"use client";

import withAuth from "@/auth/WithAuth";
import Loader from "@/components/Loader";
import SideBar from "@/components/SideBar";
import { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { log } from "util";

function LentedBook() {
  type Book = {
    lended_id: string;
    book_name: string;
    borrower_name: string;
    academic_year: string;
    book_code: string;
    lend_date: string;
  };

  const [loading, setLoading] = useState(false);
  const [lendedBooks, setLendedBooks] = useState<Book[]>([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState<string>("year");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchLendedBooks = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/api/books/lended-books`);

        if (res.status === 204) {
          toast.error("No Lended Books",{
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });

          setLendedBooks([]);
          return;
        }

        const data = await res.json();
        setLendedBooks(data.lendedBooks || []);
      } catch {
        toast.error("Something Went Wrong! reload page",{
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        })
      }finally{
        setLoading(false);
      }
    };

    fetchLendedBooks();
  }, [API_URL]);

  const filterBooks = lendedBooks.filter((book) => {
    const matchesYear =
      selectedYear === "year" || book.academic_year === selectedYear;
    const matchesSearch = book.borrower_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const displayedBooks = filterBooks;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = displayedBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayedBooks.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const refreshLendedBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/books/lended-books`);

      if (res.status === 204) {
        console.log("No Lended Books Found");
        setLendedBooks([]);
        return;
      }

      const data = await res.json();
      setLendedBooks(data.lendedBooks || []);
    } catch (error) {
      console.error("Error fetching Novels", error);
    }finally{
      setLoading(false);
    }
  };

  const handleReturn = async (lend_id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/books/return-book/${lend_id}`);

      const data = await res.json();      

      if (data.book.borrower) {
        toast.success(`${data.book.borrower} Returned Book`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }

      await refreshLendedBooks();
    } catch {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }finally{
      setLoading(false)
    }
  };

  const totalLendedBooks = lendedBooks.length;

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div className="flex">
          <SideBar logoUrl="../svg/library.svg" avatarUrl="../image/avatar.png" />
          <div className="w-[80%] py-6 px-12 space-y-10">
            <div className="flex items-center justify-between w-full sticky top-0 bg-white pb-10 pt-4">
              <input
                type="search"
                placeholder="Search by borrower name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
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
                <p className="text-xl text-indigo-900">
                  Lended Books{" "}
                  <span className="text-indigo-900 font-extrabold ">
                    ( {totalLendedBooks} in Total )
                  </span>
                </p>
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
                      Book Name
                    </th>
                    <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                      Borrower Name
                    </th>
                    <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                      Academic Year
                    </th>
                    <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                      Book Code
                    </th>
                    <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                      Lend Date
                    </th>
                    <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.length > 0 ? (
                    currentBooks.map((book, index) => (
                      <tr key={index} className="text-center hover:bg-gray-100">
                        <td className="border text-start border-indigo-900 text-gray-600 px-12 py-2">
                          {book.book_name}
                        </td>
                        <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                          {book.borrower_name}
                        </td>
                        <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                          {book.academic_year}
                        </td>
                        <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                          {book.book_code}
                        </td>
                        <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                          {formatDate(book.lend_date)}
                        </td>
                        <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                          <button
                            onClick={() => handleReturn(book.lended_id)}
                            className="text-white bg-indigo-900 rounded-xl px-6 py-2"
                          >
                            Return
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center hover:bg-gray-100">
                      <td
                        colSpan={6}
                        className="border border-indigo-900 text-red-600 px-4 py-12 text-2xl"
                      >
                        No Book Lended
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
      )}
    </>
  );
}

export default withAuth(LentedBook);
