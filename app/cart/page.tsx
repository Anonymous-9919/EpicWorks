"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatKWD, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

export default function CartPage() {
  const { locale } = useLocale();
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-8">{t("cart.title", locale)}</h1>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted text-lg mb-1">{t("cart.empty", locale)}</p>
          <p className="text-text-muted text-sm mb-6">{t("cart.empty-desc", locale)}</p>
          <Link href="/products">
            <Button variant="primary">{t("nav.shop", locale)}</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 bg-surface rounded-2xl border border-border p-4"
            >
              <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="text-sm md:text-base font-semibold text-text hover:text-secondary transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-sm text-secondary font-bold mt-1">{formatKWD(item.price)}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center rounded-lg bg-surface-light/50 border border-border">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2.5 hover:text-secondary">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2.5 hover:text-secondary">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-text">{formatKWD(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.productId)} className="p-2.5 rounded-lg hover:bg-accent/10 text-text-muted hover:text-accent">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Summary */}
          <div className="bg-surface rounded-2xl border border-border p-5 mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">{t("cart.subtotal", locale)}</span>
              <span className="font-semibold text-text">{formatKWD(getSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">{t("cart.service-fee", locale)}</span>
              <span className="font-semibold text-success">{t("cart.free", locale)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold text-text">{t("cart.total", locale)}</span>
              <span className="font-bold text-lg text-secondary">{formatKWD(getSubtotal())}</span>
            </div>

            <Link href="/checkout">
              <Button size="lg" variant="primary" className="w-full mt-2">
                {t("cart.checkout", locale)}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link href="/products" className="block text-center text-sm text-text-muted hover:text-secondary transition-colors mt-2">
              <ArrowLeft className="w-4 h-4 inline mr-1" /> {t("cart.continue", locale)}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
