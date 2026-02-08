"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import {
  Briefcase,
  HomeIcon,
  MessageSquare,
  Search,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

function Header() {
  return (
    <div className="flex items-center p-2 max-w-5xl mx-auto">
      <Image
        className="rounded-lg"
        src="https://links.papareact.com/b3z"
        width={40}
        height={40}
        alt="Logo"
      />
      <div className="flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
          <Search className="h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 outline-none"
          />
        </form>
      </div>
      <div className="flex items-center px-6 space-x-4">
        <Link href="/" className="icon">
          <HomeIcon className="h-5" />
          <p>Home</p>
        </Link>
        <Link href="/network" className="icon hidden md:flex">
          <UsersIcon className="h-5" />
          <p>Network</p>
        </Link>
        <Link href="/jobs" className="icon hidden md:flex">
          <Briefcase className="h-5" />
          <p>Jobs</p>
        </Link>
        <Link href="" className="icon hidden md:flex">
          <MessageSquare className="h-5" />
          <p>Messaging</p>
        </Link>
      </div>
      <SignedIn>
        <UserButton />
      </SignedIn>

      <SignedOut>
        <Button asChild variant={"secondary"}>
          <SignInButton />
        </Button>
      </SignedOut>
    </div>
  );
}

export default Header;
