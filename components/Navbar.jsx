import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/" aria-label="Medibuddy home">
          <img src="/logo.svg" alt="Medibuddy" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/#features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="/#about" className="text-gray-600 hover:text-gray-900">
            About Us
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;