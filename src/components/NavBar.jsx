"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AccountInput from "../components/AccountInput";
import AccountSelector from "../components/AccountSelector";
import Guide from "./Guide";

export function NavBar() {
  const navItems = [
    {
      name: "Upload",
      link: "/",
    },
    {
      name: "Gallery", // Fixed typo from "Galllery"
      link: "/gallery",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSelector, setShowSelector] = useState(false); // Added missing state

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          
          {/* Desktop Action Icons - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4 z-50">
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Information"
                >
                  <FaCircleInfo size={28} className="cursor-pointer" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <Guide />
              </DialogContent>
            </Dialog>
                        
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Add Account"
                >
                  <FaCirclePlus size={28} className="cursor-pointer" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <AccountInput />
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="User Menu"
                >
                  <FaUserCircle size={28} className="cursor-pointer" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <AccountSelector onClose={() => setShowSelector(false)} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
          </MobileNavHeader>

          <MobileNavMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-4 mb-6">
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300 py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="block text-lg font-medium">{item.name}</span>
                </a>
              ))}
            </div>

            {/* Mobile Action Items */}
            <div className="flex flex-col gap-3 mb-6">
              <Dialog>
                <DialogTrigger asChild>
                  <button 
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaCircleInfo size={20} />
                    <span className="text-lg font-medium">Information</span>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <Guide />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button 
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaCirclePlus size={20} />
                    <span className="text-lg font-medium">Add Account</span>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <AccountInput />
                </DialogContent>
              </Dialog>

              {/* Mobile User Menu - Use Drawer instead of Dropdown for better UX */}
              <Drawer className="z-50">
                <DrawerTrigger asChild>
                  <button 
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUserCircle size={20} />
                    <span className="text-lg font-medium">Account</span>
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Account Settings</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <AccountSelector onClose={() => setShowSelector(false)} />
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

const DummyContent = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Your page content goes here */}
    </div>
  );
};