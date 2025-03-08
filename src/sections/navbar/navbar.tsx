"use client";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

export const Navbar = () => {
  return (
    <div className="py-4 sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex justify-between items-center mx-auto w-11/12 max-w-7xl">
        <Image src="/advocate.png" alt="logo" width={200} height={600} />
        <SlideTabs />
        <AuthButtons />
      </div>
    </div>
  );
};

const SlideTabs = () => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative flex rounded-full border-2 border-black bg-white p-1"
    >
      <a href="/"><Tab setPosition={setPosition}>Home</Tab></a>
      <a href="/" ><Tab setPosition={setPosition}>Pricing</Tab></a>
      <a href="/legalAssistant">
        <Tab setPosition={setPosition}>Assistant</Tab>
      </a>
      <a href="/legalDoc">
        <Tab setPosition={setPosition}>Doc Generator</Tab>
      </a>
      <a href="/chatLegalDoc">
        <Tab setPosition={setPosition}>Legal Doc</Tab>
      </a>

      <Cursor position={position} />
    </ul>
  );
};

const AuthButtons = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <SignInButton>
          <button className="px-3 py-1.5 text-xs md:px-5 md:py-2.5 md:text-base border border-black rounded-full hover:bg-neutral-200 transition">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="px-3 py-1.5 text-xs md:px-5 md:py-2.5 md:text-base border border-black rounded-full hover:bg-neutral-200 transition">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-2">
          {/* Display username or email if available */}
          {user && (
            <span className="text-sm md:text-base text-black">
              {user.username || user.primaryEmailAddress?.emailAddress}
            </span>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>
  );
};

const Tab = ({
  children,
  setPosition,
}: {
  children: string;
  setPosition: Dispatch<SetStateAction<Position>>;
}) => {
  const ref = useRef<null | HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-7 rounded-full bg-black md:h-12"
    />
  );
};

type Position = {
  left: number;
  width: number;
  opacity: number;
};
