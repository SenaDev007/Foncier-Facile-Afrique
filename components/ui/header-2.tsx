'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Menu, X, ChevronDown } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useScroll } from '@/components/ui/use-scroll';

export type HeaderLink = {
  label: string;
  href?: string;
  sublinks?: { label: string; href: string }[];
};

type Header2Props = {
  links: HeaderLink[];
  pathname: string;
};

export function Header2({ links, pathname }: Header2Props) {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full border-b border-[#2C2C2E] transition-all',
        scrolled && !open
          ? 'bg-[#1C1C1E]/95 supports-[backdrop-filter]:bg-[#1C1C1E]/70 border-[#3A3A3C] backdrop-blur-lg shadow-lg shadow-black/20'
          : 'bg-[#1C1C1E]',
      )}
    >
      <nav className="container-site flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Foncier Facile Afrique — Accueil">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <Image src="/images/logo/logo FFA.png" alt="" width={48} height={48} className="object-contain" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-heading font-bold text-[#EFEFEF] text-lg tracking-tight">Foncier Facile</span>
            <span className="text-[#D4A843] text-xs font-semibold tracking-widest uppercase">Afrique</span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {links.map((link) => {
            if (link.sublinks) {
              const isSubActive = link.sublinks.some(sub => pathname === sub.href);
              return (
                <div key={link.label} className="group relative">
                  <button
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'sm' }),
                      isSubActive ? 'text-[#D4A843]' : 'text-[#8E8E93] hover:text-[#EFEFEF]',
                      'cursor-default'
                    )}
                  >
                    {link.label}
                    <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 rounded-xl border border-[#3A3A3C] bg-[#2C2C2E] p-1.5 opacity-0 shadow-xl transition-all duration-200 invisible group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 group-hover:mt-2">
                    <div className="flex flex-col gap-0.5">
                      {link.sublinks.map((sub) => {
                        const isSubSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              'block rounded-lg px-3 py-2 text-sm transition-colors',
                              isSubSubActive
                                ? 'bg-[rgba(212,168,67,0.1)] text-[#D4A843]'
                                : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-[#EFEFEF]'
                            )}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  isActive ? 'text-[#D4A843] bg-[rgba(212,168,67,0.1)]' : 'text-[#8E8E93] hover:text-[#EFEFEF]',
                )}
                href={link.href!}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/admin" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-[#3A3A3C] text-[#EFEFEF]')}>
            <LayoutDashboard className="h-4 w-4" />
            Backoffice
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: 'default', size: 'sm' })}>
            Nous contacter
          </Link>
        </div>

        <Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="lg:hidden border-[#3A3A3C] text-[#EFEFEF]">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </nav>

      <div className={cn('bg-[#1C1C1E]/95 fixed top-[72px] right-0 bottom-0 left-0 z-50 flex flex-col overflow-y-auto border-y border-[#2C2C2E] lg:hidden', open ? 'block' : 'hidden')}>
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
            'flex min-h-full w-full flex-col justify-between gap-y-6 p-4 pb-8',
          )}
        >
          <div className="grid gap-y-2">
            {links.map((link) => {
              if (link.sublinks) {
                return (
                  <div key={link.label} className="flex flex-col gap-1 mt-2 mb-2">
                    <span className="px-4 py-2 text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">{link.label}</span>
                    {link.sublinks.map(sub => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          buttonVariants({ variant: 'ghost', className: 'justify-start pl-8 text-[#EFEFEF]' }),
                          pathname === sub.href && 'text-[#D4A843] bg-[rgba(212,168,67,0.12)]'
                        )}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  className={cn(
                    buttonVariants({ variant: 'ghost', className: 'justify-start text-[#EFEFEF]' }),
                    pathname === link.href && 'text-[#D4A843] bg-[rgba(212,168,67,0.12)]',
                  )}
                  href={link.href!}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <Link href="/admin" className={cn(buttonVariants({ variant: 'outline' }), 'w-full border-[#3A3A3C] text-[#EFEFEF]')}>
              Backoffice
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: 'default' }), 'w-full')}>
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
