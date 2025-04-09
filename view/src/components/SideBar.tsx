import Link from "next/link";
import LibraryAccordion from "./LibraryAccordion";
import { BiMath } from "react-icons/bi";
import { FaArchive } from "react-icons/fa";
import { FaMicroscope, FaEarthAfrica, FaLanguage } from "react-icons/fa6";
import { GiAtom, GiTakeMyMoney } from "react-icons/gi";
import { IoMagnetOutline } from "react-icons/io5";
import { SiStudyverse } from "react-icons/si";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface LibraryProps {
  logoUrl: string;
}

export default function SideBar({ logoUrl }: LibraryProps) {
  const ordinaryLevel = [
    { icon: <BiMath />, link: "Mathematics" },
    { icon: <IoMagnetOutline />, link: "Physics" },
    { icon: <FaMicroscope />, link: "Biology" },
    { icon: <FaEarthAfrica />, link: "Geography" },
    { icon: <GiAtom />, link: "Chemistry" },
    { icon: <FaArchive />, link: "History" },
    { icon: <GiTakeMyMoney />, link: "E-Ship" },
    { icon: <FaLanguage />, link: "Ikinyarwanda" },
    { icon: <FaLanguage />, link: "English" },
  ];

  const advancedLevel = [
    { icon: <BiMath />, link: "Mathematics" },
    { icon: <IoMagnetOutline />, link: "Computer Science" },
    { icon: <GiTakeMyMoney />, link: "Economics" },
    { icon: <FaEarthAfrica />, link: "Geography" },
    { icon: <GiTakeMyMoney />, link: "E-Ship" },
    { icon: <FaLanguage />, link: "Ikinyarwanda" },
    { icon: <FaLanguage />, link: "English" },
    { icon: <SiStudyverse />, link: "GSCS" },
  ];

  const sideBarLinks = [
    
    { linkName: "Course Books", destination: "/library" },
    { linkName: "Novels", destination: "/library/novels" },
    { linkName: "Lended Books", destination: "/library/lended" },
    { linkName: "Returned Books", destination: "/library/returned" },
    { linkName: "Lost Books", destination: "/library/lost" },
  ];

  const path =usePathname();  

  const isActive =(pathname:string)=>{
    return pathname === path;
  }

  return (
    <div className="w-[15%] bg-indigo-900 min-h-screen px-6 py-8 space-y-12">
      <div className="space-y-6 fixed w-[13%]">
        <div className="w-full bg-indigo-900 sticky top-0 z-50 py-6">
          <Image src={logoUrl} height={200} width={200} alt="Library" />
        </div>
        <div className="space-y-6">
          {sideBarLinks.map((link, index) => (
            <Link
              key={index}
              href={link.destination}
              className={`font-semibold ${link.destination && isActive(link.destination) ? "bg-white text-indigo-900 py-3 rounded-lg":"hover:bg-white hover:text-indigo-900 text-white py-3 rounded-lg duration-500"}  block px-4`}
            >
              {link.linkName}
            </Link>
          ))}
        </div>
        <LibraryAccordion
          title="Ordinary Level "
          items={ordinaryLevel}
          initiallyOpen={false}
        />
        <LibraryAccordion
          title="Advanced Level "
          items={advancedLevel}
          initiallyOpen={false}
        />
      </div>
    </div>
  );
}
