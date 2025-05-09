// src/components/Header.tsx
import Link from 'next/link';
import AuthButton from './AuthButton';
import { CodeXml } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <CodeXml className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            PromptCoder
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          {/* Add nav links here if needed */}
        </nav>
        <div className="flex items-center space-x-2">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
