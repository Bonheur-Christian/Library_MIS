import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface LibraryProps {
  logoUrl: string;
  avatarUrl: string;
}

interface User {
  id: string;
  email: string;
  username: string;
}

export default function SideBar({ logoUrl, avatarUrl }: LibraryProps) {
  const [user, setUser] = useState<User | null>(null);

  const sideBarLinks = [
    { linkName: "Course Books", destination: "/library" },
    { linkName: "Novels", destination: "/library/novels" },
    { linkName: "Lended Books", destination: "/library/lended" },
  ];

  const path = usePathname();

  useEffect(() => {
    // Safely get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const isActive = (pathname: string) => {
    return pathname === path;
  };

  return (
    <div className="w-[23rem] bg-indigo-900 min-h-screen px-6 overflow-y-auto scrollbar-hidden">
      <div className="space-y-6">
        <div className="w-[18%] bg-indigo-900 fixed top-0 z-50 py-6">
          <Image
            src={logoUrl}
            height={200}
            width={200}
            alt="Library"
            unoptimized
          />
        </div>
        <div className="space-y-6 mt-[20rem]">
          {sideBarLinks.map((link, index) => (
            <Link
              key={index}
              href={link.destination}
              className={`font-semibold ${
                isActive(link.destination)
                  ? "bg-white text-indigo-900 py-3 rounded-lg"
                  : "hover:bg-white hover:text-indigo-900 text-white py-3 rounded-lg duration-500"
              } block px-4`}
            >
              {link.linkName}
            </Link>
          ))}
        </div>
        {user && (
          <div className="fixed bottom-24 w-full  text-white">
            <div className="flex items-center gap-4">
              <Image
                src={avatarUrl}
                alt="User avatar"
                width={50}
                height={50}
                className="rounded-full"
                unoptimized
              />
              <p className="text-2xl font-extrabold truncate pt-4">
                {user.username}
              </p>
            </div>
          
          </div>
        )}
      </div>
    </div>
  );
}
