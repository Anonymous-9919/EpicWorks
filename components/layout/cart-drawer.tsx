"use client";

import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { formatKWD, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

export function CartDrawer() {
  const { locale } = useLocale();
  const { items, removeItem, updateQuantity, getSubtotal, cartDrawerOpen, setCartDrawerOpen } = useCartStore();

  return (
    <>
      {cartDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setCartDrawerOpen(false)}
        />
      )}

      {cartDrawerOpen && (
        <div className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border rounded-t-3xl max-h-[85vh] flex flex-col",
          "md:right-4 md:left-auto md:top-4 md:bottom-auto md:w-96 md:rounded-2xl md:max-h-[90vh] md:border"
        )}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-secondary" />
              <span className="font-semibold text-text">{t("nav.cart", locale)} ({items.length})</span>
            </div>
            <button onClick={() => setCartDrawerOpen(false)} className="p-2 rounded-lg hover:bg-surface-light/50">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                <p className="text-text-muted text-sm">{t("cart-drawer.empty", locale)}</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="flex gap-3 bg-surface-light/30 rounded-xl p-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} className="text-sm font-medium text-text hover:text-secondary truncate block">
                      {item.name}
                    </Link>
                    <p className="text-xs text-text-muted mt-0.5">{formatKWD(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-9 h-9 rounded-lg bg-surface-light flex items-center justify-center hover:bg-surface-light/80"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-medium w-7 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-9 h-9 rounded-lg bg-surface-light flex items-center justify-center hover:bg-surface-light/80"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto p-2.5 rounded-lg hover:bg-accent/10 text-text-muted hover:text-accent"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">{t("cart.subtotal", locale)}</span>
                <span className="font-bold text-text">{formatKWD(getSubtotal())}</span>
              </div>
              <Link href="/cart" onClick={() => setCartDrawerOpen(false)}>
                <Button className="w-full" size="lg">
                  {t("cart-drawer.view-cart", locale)}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
