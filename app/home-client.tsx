"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Wrench, ShieldCheck, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import type { Product } from "@/types";

export default function HomeClient({
  featured,
  newArrivals,
}: {
  featured: Product[];
  newArrivals: Product[];
}) {
  const { locale } = useLocale();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  const features = [
    { icon: Wrench, title: t("feature.professional", locale), desc: t("feature.professional-desc", locale) },
    { icon: ShieldCheck, title: t("feature.premium", locale), desc: t("feature.premium-desc", locale) },
    { icon: Car, title: t("feature.mobile", locale), desc: t("feature.mobile-desc", locale) },
  ];

  const displayProducts = featured.length > 0 ? featured : newArrivals;

  return (
    <>
      <section ref={heroRef} className="relative h-[100dvh] overflow-hidden">
        <motion.div style={{ y: videoY }} className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/product-001.png"
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-[#0b132b]/80 via-[#0b132b]/30 to-primary/80" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <Badge variant="new" className="mb-6 text-xs">
            {t("hero.badge", locale)}
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl">
            {t("hero.title1", locale)}{" "}
            <span className="text-secondary">{t("hero.title2", locale)}</span>
            <br />
            {t("hero.title3", locale)}
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl">
            {t("hero.subtitle", locale)}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/products?category=ppf">
              <Button variant="primary" size="lg">
                {t("hero.cta-ppf", locale)}
                <ArrowRight className={`ml-2 w-4 h-4 ${locale === "ar" ? "transform scale-x-[-1]" : ""}`} />
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                {t("hero.cta-all", locale)}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="relative z-20 -mt-16 md:-mt-20 px-4 max-w-7xl mx-auto">
        <div className="bg-surface rounded-2xl border border-border shadow-lg grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {features.map((f, i) => (
            <div key={i} className="p-6 md:p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-text">{f.title}</h3>
              <p className="text-sm text-text-muted mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-text">
              {t("section.featured", locale)}
            </h2>
            <Link
              href="/products"
              className="text-sm text-secondary hover:text-secondary-dark font-medium transition-colors"
            >
              {t("section.view-all", locale)} →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.slice(0, 8).map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-secondary/10 to-primary-light border border-border p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text">
              {t("section.cta-title", locale)}
            </h2>
            <p className="mt-4 text-text-muted max-w-xl mx-auto">
              {t("section.cta-desc", locale)}
            </p>
            <div className="mt-6">
              <Link href="/products">
                <Button variant="primary" size="lg">
                  {t("section.cta-button", locale)}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
