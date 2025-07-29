'use client';
import TopBar from "./TopBar";
import LogoSearchIcons from "./LogoSearchIcons";
import NavLinks from "./NavLinks";

export default function Navbar() {
  return (
    <header className="border-b shadow-sm fixed w-full z-50 bg-white dark:bg-black">
      <TopBar />
      <LogoSearchIcons />
      <NavLinks />
    </header>
  );
}
