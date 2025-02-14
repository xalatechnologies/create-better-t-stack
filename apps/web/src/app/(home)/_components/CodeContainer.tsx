"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import PackageIcon from "./Icons";

const CodeContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPM, setSelectedPM] = useState<"npm" | "yarn" | "pnpm" | "bun">("npm");
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const commands = {
    npm: "npx create-better-t-stack@latest",
    yarn: "yarn dlx create better-t-stack",
    pnpm: "pnpm dlx create better-t-stack",
    bun: "bunx create-better-t-stack"
  };

  const copyToClipboard = async (pm: "npm" | "yarn" | "pnpm" | "bun") => {
    await navigator.clipboard.writeText(commands[pm]);
    setSelectedPM(pm);
    setCopied(true);
    setIsOpen(false);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg backdrop-blur-lg opacity-25 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative rounded-lg p-1 bg-slate-900/30 backdrop-blur-xl">
          <div className="p-4 font-mono text-gray-300 text-sm bg-black/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronRight />
              <span className="text-base bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400">
                {commands[selectedPM]}
              </span>
            </div>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 w-10 justify-center rounded-md cursor-pointer hover:bg-white/10 transition-colors text-gray-300 hover:text-white relative"
              >
                {copied ? (
                  <span className="flex items-center space-x-2">
                    <CheckIcon className="w-5 h-5" />
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <CopyIcon className="w-5 h-5" />
                  </span>
                )}
              </button>
              {isOpen && (
                <div className="absolute right-6 top-8 mt-2 w-24 rounded-lg backdrop-blur-lg bg-violet-950/10 shadow-xl ring-1 ring-white/10 divide-y divide-gray-700/30 transition-all duration-200">
                  {(["npm", "yarn", "pnpm", "bun"] as const).map((pm) => (
                    <button
                      key={pm}
                      onClick={() => copyToClipboard(pm)}
                      className="group cursor-pointer flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <PackageIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" pm={pm} /> {pm}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


const CopyIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const CheckIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default CodeContainer;