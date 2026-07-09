"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Wrench, ShieldCheck, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts, getNewArrivals } from "@/lib/products";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

export default function HomePage() {
  const { locale } = useLocale();
  const featured = getFeaturedProducts(locale);
  const newArrivals = getNewArrivals(locale);
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

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="relative h-[100dvh] min-h-[480px] sm:min-h-[600px] max-h-[900px] overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: videoY }}>
          <video autoPlay muted loop playsInline poster="/images/product-001.png" className="w-full h-full object-cover">
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0b132b]/80 via-[#0b132b]/40 to-transparent" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0b132b]/60 via-transparent to-[#0b132b]/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2.5 mb-6">
              <Badge variant="category" className="text-xs text-white/80 border-white/20">{t("hero.badge", locale)}</Badge>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] mb-5 text-white">
              {t("hero.title1", locale)}{" "}
              <span className="text-secondary">{t("hero.title2", locale)}</span>
              <br />
              {t("hero.title3", locale)}
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-xl mb-8">
              {t("hero.subtitle", locale)}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/products?category=ppf">
                <Button size="lg" variant="primary" className="w-full sm:w-auto">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  {t("hero.cta-ppf", locale)}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
                  <Car className="w-5 h-5 mr-2" />
                  {t("hero.cta-all", locale)}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 -mt-16 md:-mt-20">
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-4 md:p-5"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-text">{f.title}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="bg-primary-light/50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-text">{t("section.featured", locale)}</h2>
            <Link href="/products" className="text-sm text-secondary hover:underline hidden sm:block">
              {t("section.view-all", locale)} →
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="bg-gradient-to-br from-secondary/10 to-primary-light rounded-3xl p-8 md:p-14 text-center border border-secondary/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-text mb-3">
              {t("section.cta-title", locale)}
            </h2>
            <p className="text-text-muted max-w-lg mx-auto mb-8">
              {t("section.cta-desc", locale)}
            </p>
            <Link href="/products">
              <Button size="lg" variant="primary">
                {t("section.cta-button", locale)}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
