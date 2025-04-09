import { IoMdNotificationsOutline } from "react-icons/io";

export default function TopBar() {
  return (
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
  );
}
