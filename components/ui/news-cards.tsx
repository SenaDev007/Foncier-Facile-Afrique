"use client";

import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "framer-motion";
import { useState } from "react";
import { BookmarkIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NewsCard {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  timeAgo: string;
  location: string;
  image: string;
  gradientColors?: string[];
  content?: string[];
}

interface StatusBar {
  id: string;
  category: string;
  subcategory: string;
  length: number;
  opacity: number;
}

interface NewsCardsProps {
  title?: string;
  subtitle?: string;
  statusBars?: StatusBar[];
  newsCards?: NewsCard[];
  enableAnimations?: boolean;
}

const defaultStatusBars: StatusBar[] = [
  { id: "1", category: "Annonces", subcategory: "Terrains", length: 3, opacity: 1 },
  { id: "2", category: "Annonces", subcategory: "Maisons", length: 2, opacity: 0.7 },
  { id: "3", category: "Annonces", subcategory: "Villas", length: 1, opacity: 0.4 },
];

export function NewsCards({
  title = "",
  subtitle = "",
  statusBars = defaultStatusBars,
  newsCards = [],
  enableAnimations = true,
}: NewsCardsProps) {
  const [selectedCard, setSelectedCard] = useState<NewsCard | null>(null);
  const [bookmarkedCards, setBookmarkedCards] = useState<Set<string>>(new Set());
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  const toggleBookmark = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-[#161618] text-[#EFEFEF]">
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h2 className="text-4xl font-bold mb-2 font-heading">{title}</h2>}
          {subtitle && <p className="text-[#8E8E93] text-lg">{subtitle}</p>}
          <div className="mt-6 space-y-1">
            {statusBars.map((bar) => (
              <div
                key={bar.id}
                className={cn("h-0.5 rounded-full", bar.id === "1" ? "bg-[#D4A843]" : "bg-[#D4A843]/60")}
                style={{ opacity: bar.opacity, width: `${(bar.length / 3) * 100}%` }}
              />
            ))}
          </div>
        </div>
      )}

      <LayoutGroup>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {newsCards.map((card) => {
            if (selectedCard?.id === card.id) return null;
            return (
              <motion.article
                key={card.id}
                layoutId={`card-${card.id}`}
                className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-lg overflow-hidden transition-all duration-300 cursor-pointer group"
                whileHover={shouldAnimate ? { y: -4, scale: 1.01 } : {}}
                onClick={() => setSelectedCard(card)}
              >
                <motion.div layoutId={`card-image-${card.id}`} className="relative h-56 overflow-hidden bg-[#1C1C1E]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black/70 to-transparent" />
                  <motion.div className="absolute top-3 right-3" onClick={(e) => toggleBookmark(card.id, e)}>
                    <BookmarkIcon className={cn("w-5 h-5 cursor-pointer", bookmarkedCards.has(card.id) ? "text-[#D4A843] fill-[#D4A843]" : "text-white/80")} />
                  </motion.div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="text-xs mb-1 opacity-90">{card.category}, {card.subcategory}</div>
                    <div className="text-xs opacity-75">{card.timeAgo}, {card.location}</div>
                  </div>
                </motion.div>
                <motion.div layoutId={`card-content-${card.id}`} className="p-6">
                  <motion.h3 layoutId={`card-title-${card.id}`} className="font-semibold text-lg leading-tight line-clamp-3 group-hover:text-[#D4A843] transition-colors">
                    {card.title}
                  </motion.h3>
                </motion.div>
              </motion.article>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {selectedCard && (
            <>
              <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCard(null)} />
              <motion.div layoutId={`card-${selectedCard.id}`} className="fixed inset-4 md:inset-8 lg:inset-16 bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl overflow-hidden z-50">
                <button className="absolute top-4 right-4 w-8 h-8 bg-black/60 hover:bg-black rounded-full flex items-center justify-center z-10" onClick={() => setSelectedCard(null)}>
                  <X className="w-4 h-4" />
                </button>
                <div className="h-full overflow-y-auto">
                  <motion.div layoutId={`card-image-${selectedCard.id}`} className="relative h-64 md:h-80">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedCard.image} alt={selectedCard.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white text-sm">
                      {selectedCard.category}, {selectedCard.subcategory} - {selectedCard.timeAgo}
                    </div>
                  </motion.div>
                  <motion.div layoutId={`card-content-${selectedCard.id}`} className="p-6 md:p-8">
                    <motion.h1 layoutId={`card-title-${selectedCard.id}`} className="text-2xl md:text-3xl font-bold mb-6 font-heading">{selectedCard.title}</motion.h1>
                    <div className="text-[#8E8E93] space-y-4">
                      {(selectedCard.content && selectedCard.content.length ? selectedCard.content : ["Plus de détails disponibles sur la fiche annonce."]).map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
