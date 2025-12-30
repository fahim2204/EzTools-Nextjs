"use client";

import React from "react";
import Image from "next/image";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button
} from "@nextui-org/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Image Tools", href: "/#image-tools" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <NextUINavbar onMenuOpenChange={setIsMenuOpen} className="bg-black/30 backdrop-blur-md border-b border-white/10">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2 font-bold text-inherit text-white text-xl group transition-all duration-300 hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="ImagePix Logo"
              width={32}
              height={32}
              className="aspect-square transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            />
            <span className="transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-cyan-400 group-hover:to-teal-400 group-hover:bg-clip-text group-hover:text-transparent">
              ImagePix
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/#image-tools" className="text-gray-300 hover:text-white transition-colors">
            Image Tools
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="/" variant="flat" className="bg-white/10 text-white hover:bg-white/20">
            All Tools
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-black/90 pt-10">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-white text-lg py-2"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
}
