export default function NavLinks() {
  const links = [
    "NEW",
    "GAMING PCS",
    "GPUS",
    "COMPONENTS",
    "PERIPHERALS",
    "OTHER SYSTEMS",
    "RETRO",
    "MORE",
  ];

  return (
    <nav className="max-w-7xl mx-auto px-4 py-1 flex gap-6 text-sm font-semibold">
      {links.map((link) => (
        <a href="#" key={link}>
          {link === "RETRO" ? (
            <span>
              {link} <span className="text-xs text-white bg-orange-500 rounded px-1">NEW</span>
            </span>
          ) : (
            link
          )}
        </a>
      ))}
    </nav>
  );
}
