"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

export function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const trackId = searchParams.get("track_id") || searchParams.get("order_id") || "";
  const isSandbox = searchParams.get("sandbox") === "true";

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">{t("order.success-title", locale)}</h1>
        <p className="text-text-muted mb-2">
          {t("order.success-desc", locale)}
        </p>
        {isSandbox && (
          <div className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            {t("order.sandbox", locale)}
          </div>
        )}
        {trackId && (
          <p className="text-xs text-text-muted mb-8">
            {t("order.id", locale)}: <span className="font-mono text-text">{trackId.slice(0, 16)}...</span>
          </p>
        )}
        <div className="bg-surface rounded-2xl border border-border p-5 mb-8 text-left">
          <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-secondary" /> {t("order.next-title", locale)}
          </h3>
          <ol className="space-y-2 text-sm text-text-muted">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              {t("order.next-1", locale)}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              {t("order.next-2", locale)}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              {t("order.next-3", locale)}
            </li>
          </ol>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products">
            <Button variant="primary">{t("order.continue", locale)} <ArrowRight className={`w-4 h-4 ms-2 ${locale === "ar" ? "scale-x-[-1]" : ""}`} /></Button>
          </Link>
          <Link href="/">
            <Button variant="outline">{t("order.back-home", locale)}</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
