import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        

        <div>
          <img src="/logo.svg" className="h-10 w-auto" />
        </div>


        <div className="flex items-center gap-10">
    
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>

          <a href="#about" className="text-gray-600 hover:text-gray-900">About Us</a>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;