'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';

export type HeaderLink = {
  label: string;
  href: string;
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
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  isActive ? 'text-[#D4A843] bg-[rgba(212,168,67,0.1)]' : 'text-[#8E8E93] hover:text-[#EFEFEF]',
                )}
                href={link.href}
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
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      <div className={cn('bg-[#1C1C1E]/95 fixed top-[72px] right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y border-[#2C2C2E] lg:hidden', open ? 'block' : 'hidden')}>
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
            'flex h-full w-full flex-col justify-between gap-y-2 p-4',
          )}
        >
          <div className="grid gap-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                className={cn(
                  buttonVariants({ variant: 'ghost', className: 'justify-start text-[#EFEFEF]' }),
                  pathname === link.href && 'text-[#D4A843] bg-[rgba(212,168,67,0.12)]',
                )}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
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
