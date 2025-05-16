"use client";

import withAuth from "@/auth/WithAuth";
import Loader from "@/components/Loader";
import SideBar from "@/components/SideBar";
import { useEffect, useRef, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchLendedBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/books/lended-books`);

        if (res.status === 204) {
          toast.error("No Lended Books", {
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
        toast.error("Something Went Wrong! reload page", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLendedBooks();
  }, [API_URL]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeButton = container.querySelector(
        `.active-page-${currentPage}`
      );

      if (activeButton) {
        const buttonLeft = (activeButton as HTMLElement).offsetLeft;
        const containerWidth = container.clientWidth;
        const buttonWidth = (activeButton as HTMLElement).clientWidth;

        container.scrollLeft =
          buttonLeft - containerWidth / 2 + buttonWidth / 2;
      }
    }
  }, [currentPage]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (lend_id: string) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const totalLendedBooks = lendedBooks.length;

  const handleDownloadPDF = async () => {
    try {
      const res = await fetch(`${API_URL}/api/books/lending-summary`, {
        method: "GET",
        mode: "cors",
      });

      if (res.status === 204) {
        toast.info("No Lending Records Found", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "lending_summary_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF Report Downloaded !", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div className="flex">
          <SideBar
            logoUrl="../svg/library.svg"
            avatarUrl="../image/avatar.png"
          />
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
                <button
                  onClick={handleDownloadPDF}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
                >
                  Download PDF
                </button>
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
                <div className="flex justify-center items-center mt-6 w-full">
                  <div className="flex items-center w-full">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-4 py-2 border border-indigo-900 hover:bg-indigo-900 hover:text-white rounded disabled:opacity-50 flex-shrink-0"
                    >
                      Prev
                    </button>

                    <div
                      className="overflow-x-auto mx-2 flex-grow scrollbar-hidden"
                      ref={scrollContainerRef}
                    >
                      <div className="inline-flex space-x-2 px-1 py-1 min-w-full justify-center">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-4 py-2 border rounded flex-shrink-0 active-page-${i + 1} ${
                              currentPage === i + 1
                                ? "bg-indigo-900 text-white"
                                : "border-indigo-900 hover:bg-indigo-900 hover:text-white"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-4 py-2 border border-indigo-900 hover:bg-indigo-900 hover:text-white rounded disabled:opacity-50 flex-shrink-0"
                    >
                      Next
                    </button>
                  </div>
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