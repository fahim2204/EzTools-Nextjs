"use client";

import React from "react";
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
    { name: "Age Calculator", href: "/age-calculator" },
    { name: "BMI Calculator", href: "/bmi-calculator" },
    { name: "Gold Price", href: "/gold-price-calculator" },
    { name: "Land Area", href: "/land-calculator" },
    { name: "Loan", href: "/loan-calculator" },
    { name: "Mortgage", href: "/mortgage-calculator" },
    { name: "Percentage", href: "/percentage-calculator" },
    { name: "Tip", href: "/tip-calculator" },
  ];

  return (
    <NextUINavbar onMenuOpenChange={setIsMenuOpen} className="bg-black/30 backdrop-blur-md border-b border-white/10">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit text-white text-xl">
            EZCalc
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/age-calculator" className="text-gray-300 hover:text-white transition-colors">
            Age
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/bmi-calculator" className="text-gray-300 hover:text-white transition-colors">
            BMI
          </Link>
        </NavbarItem>
         <NavbarItem>
          <Link href="/gold-price-calculator" className="text-gray-300 hover:text-white transition-colors">
            Gold
          </Link>
        </NavbarItem>
        <NavbarItem>
            <Link href="/loan-calculator" className="text-gray-300 hover:text-white transition-colors">
            Loan
            </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="/" variant="flat" className="bg-white/10 text-white hover:bg-white/20">
             All Calculators
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
