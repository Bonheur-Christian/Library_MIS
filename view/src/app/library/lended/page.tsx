"use client";

import SideBar from "@/components/SideBar";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";

export default function LentedBook() {
  type Book = {
    book_id: number;
    bookname: string;
    subject: string;
    academic_year: string;
    isbn: string;
    published_year: number;
    quantity: number;
  };

  const [lentedBooks, setLentedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchLentedBooks = async () => {
      try {
        const res = await fetch(
          "http://localhost:3001/api/course-books/all-books"
        );
      } catch (err) {
        console.log("Error in fetching Lented Books", err);
      }
    };
  }, []);
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
            <p className="text-xl text-indigo-900">All Books</p>
            <FaPlus
              size={25}
              title="Add Book"
              className="text-indigo-900 font-light cursor-pointer"
            />
          </div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Book Id
                </th>
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Book Name
                </th>
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Subject
                </th>
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Academic Year
                </th>
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  ISBN
                </th>
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Published Year
                </th>
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Quantity(copies)
                </th>
                <th className="border-2 border-indigo-900 text-gray-600 px-4 py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {lentedBooks.map((book, index) => (
                <tr key={index} className="text-center hover:bg-gray-100 ">
                  <td className="border border-indigo-900 text-gray-600 px-4 py-2 ">
                    {book.book_id}
                  </td>
                  <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                    {book.bookname}
                  </td>
                  <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                    {book.subject}
                  </td>
                  <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                    {book.academic_year}
                  </td>
                  <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                    {book.isbn}
                  </td>
                  <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                    {book.published_year}
                  </td>
                  <td className="border border-indigo-900 text-gray-600 px-4 py-2">
                    {book.quantity}
                  </td>
                  <td className="border border-indigo-900 px-4 py-2 space-x-4 text-white">
                    <button className="bg-red-500 hover:bg-red-700 font-medium rounded-xl py-2 px-6">
                      Delete
                    </button>
                    <button className="bg-green-500 hover:bg-green-700 font-medium rounded-xl py-2 px-6">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
