"use client";

import withAuth from "@/auth/WithAuth";
import AddCourseBookModal from "@/components/AddCourseBookModal";
import EditCourseBookModal from "@/components/EditCourseBookModal";
import LendBookModal from "@/components/LendBookModal";
import Loader from "@/components/Loader";
import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import { useEffect, useRef, useState } from "react";
import { FaDeleteLeft, FaPlus } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";

function Library() {
  type Book = {
    _id: string;
    book_name: string;
    subject: string;
    academic_year: string;
    published_year: number;
    quantity: number;
  };

  const [loading, setLoading] = useState(false);
  const [courseBooks, setCourseBooks] = useState<Book[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("year");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLendModalOpen, setIsLendModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookId, setBookId] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCourseBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/books/course-books`);

        if (res.status === 204) {
          setLoading(false);
          toast.error("No Course Books In Library", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
          setCourseBooks([]);
          return;
        }

        const data = await res.json();
        setCourseBooks(data.courseBooks || []);
      } catch {
        setLoading(false);
        toast.error("Something went wrong! ⚠️ reload the page", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseBooks();
  }, [API_URL]);

  const refreshBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/books/course-books`);
      if (response.status === 204) {
        setLoading(false);
        toast.error("No Course Books In Library", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
        setCourseBooks([]);
        return;
      }

      const data = await response.json();
      if (data.courseBooks) setCourseBooks(data.courseBooks || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = courseBooks.filter((book) => {
    const query = searchQuery.toLowerCase();
    const matchesName = book.book_name.toLowerCase().includes(query);
    const matchesYear = book.academic_year.toLowerCase().includes(query);
    const yearFilterPass =
      selectedYear === "year" ||
      book.academic_year.toLowerCase() === selectedYear.toLowerCase();
    return (matchesName || matchesYear) && yearFilterPass;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (bookId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/books/delete-book/${bookId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Book deleted successfully", {
          position: "top-right",
          autoClose: 3000,
        });

        await refreshBooks();
      } else {
        toast.error(result.messageError || "Book not deleted ⚠️ try again", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch {
      toast.error("Something went wrong! reload the page and try again", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const totalCourseBooks = courseBooks.length;

  return (
    <>
      <ToastContainer />

      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div className="flex">
          <SideBar logoUrl="/svg/library.svg" avatarUrl="/image/avatar.png" />

          <div className="w-[80%] py-6 px-12 space-y-4">
            <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <div>
              <div className="flex items-center justify-between pb-6">
                <p className="text-xl text-indigo-900">
                  Course Books{" "}
                  <span className="text-indigo-900 font-extrabold">
                    ({totalCourseBooks} in Total )
                  </span>{" "}
                </p>
                <select
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
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <p className="text-xl text-indigo-900 font-bold hover:text-indigo-700">
                    Add Book
                  </p>
                  <FaPlus
                    size={25}
                    title="Add Book"
                    className="text-indigo-900 font-light cursor-pointer"
                  />
                </div>
              </div>

              <AddCourseBookModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Course Book"
                onBookAdded={refreshBooks}
              />
              <LendBookModal
                isOpen={isLendModalOpen}
                onClose={() => setIsLendModalOpen(false)}
                title="Lend Book"
                book_id={selectedBook}
                onBookLent={refreshBooks}
              />
              <EditCourseBookModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Course Book"
                book_id={bookId}
                onBookEdited={refreshBooks}
              />

              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border-2 border-indigo-900 px-2 py-2">No</th>
                    <th className="border-2 border-indigo-900 px-2 py-2">
                      Book Name
                    </th>
                    <th className="border-2 border-indigo-900 px-2 py-2">
                      Subject
                    </th>
                    <th className="border-2 border-indigo-900 px-2 py-2">
                      Academic Year
                    </th>
                    <th className="border-2 border-indigo-900 px-2 py-2">
                      Published Year
                    </th>
                    <th className="border-2 border-indigo-900 px-2 py-2">
                      Quantity
                    </th>
                    <th className="border-2 border-indigo-900 px-2 py-2">
                      Lend Book
                    </th>
                    <th className="border-2 border-indigo-900 px-2 py-2">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.length > 0 ? (
                    currentBooks.map((book, index) => (
                      <tr
                        key={book._id}
                        className="text-center hover:bg-gray-100"
                      >
                        <td className="border border-indigo-900 px-4 py-2">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="border border-indigo-900 px-4 py-2">
                          {book.book_name}
                        </td>
                        <td className="border border-indigo-900 px-4 py-2">
                          {book.subject}
                        </td>
                        <td className="border border-indigo-900 px-4 py-2">
                          {book.academic_year}
                        </td>
                        <td className="border border-indigo-900 px-4 py-2">
                          {book.published_year}
                        </td>
                        <td className="border border-indigo-900 px-4 py-2">
                          {book.quantity}
                        </td>
                        <td className="border border-indigo-900 px-4 py-2">
                          <button
                            onClick={() => {
                              setSelectedBook(book._id.toString());
                              setIsLendModalOpen(true);
                            }}
                            className="bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg py-2 px-6"
                          >
                            Lend
                          </button>
                        </td>
                        <td className="border border-indigo-900 px-4 py-2 space-x-2">
                          <button
                            onClick={() => {
                              setBookId(book._id);
                              setIsEditModalOpen(true);
                            }}
                            className="bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg py-2 px-6"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(book._id)}
                            className="bg-red-700 hover:bg-red-700 text-white font-medium rounded-full p-2"
                          >
                            <FaDeleteLeft />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center">
                      <td colSpan={9} className="text-red-600 py-12 text-2xl">
                        No Books Found
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
                            key={i}
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
            <div className="bg-indigo-100 rounded-lg py-6 px-4">
              <h2 className="text-xl font-bold text-red-500">⚠️ Warnings</h2>
              <ol className="list-decimal list-inside mt-2 text-gray-800 font-bold space-y-4">
                <li>
                  You Are Not Allowed To Delete Book When It Is Already Lent
                </li>
                <li>
                  Please Avoid Sharing Your Password With Others For Better
                  Library Security
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default withAuth(Library);
