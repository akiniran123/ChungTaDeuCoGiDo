'use client';
import TopBar from "./TopBar";
import LogoSearchIcons from "./LogoSearchIcons";
import NavLinks from "./NavLinks";

export default function Navbar() {
  return (
    <header className="border-b shadow-sm fixed w-full z-50 bg-white dark:bg-black">
      <div className="bg-white dark:bg-black text-black dark:text-white p-4">
  Hello Dark Mode!
</div>

      <TopBar />
      <LogoSearchIcons />
      <NavLinks />
    </header>
  );
}
