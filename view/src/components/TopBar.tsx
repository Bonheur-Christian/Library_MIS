import { IoMdNotificationsOutline } from "react-icons/io";

type TopBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export default function TopBar({ searchQuery, onSearchChange }: TopBarProps) {
  return (
    <div className="flex items-center justify-between w-full sticky top-0 bg-white pb-10 pt-4">
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by Book name or class ..."
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
