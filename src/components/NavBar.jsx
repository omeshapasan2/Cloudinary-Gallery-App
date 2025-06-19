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
} from "../components/ui/dropdown-menu"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AccountInput from "../components/AccountInput";
import AccountSelector from "../components/AccountSelector";
import Guide from "./Guide";


export function NavBar() {
  const navItems = [
    {
      name: "Upload",
      link: "/upload",
    },
    {
      name: "Galllery",
      link: "/gallery",
    },
    // {
    //   name: "Contact",
    //   link: "#contact",
    // },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 z-50">

                        <Dialog>
                          <DialogTrigger asChild>
                            <FaCircleInfo size={28} className="cursor-pointer" />
                          </DialogTrigger>
                          <DialogContent>
                            
                              {/* Guide Component */}
                              <Guide />
                            
                          </DialogContent>
                        </Dialog>
                                    
                        <Dialog>
                          <DialogTrigger asChild>
                            <FaCirclePlus size={28} className="cursor-pointer" />
                          </DialogTrigger>
                          <DialogContent>
                            
                              {/* Input Details Component */}
                              <AccountInput />
                            
                          </DialogContent>
                        </Dialog>
            
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <FaUserCircle size={28} className="cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            
                            <AccountSelector onClose={() => setShowSelector(false)}/>
            
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300">
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full">
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full">
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <DummyContent />
      {/* Navbar */}
    </div>
  );
}

const DummyContent = () => {
  return (
    <div>

    </div>
  );
};
