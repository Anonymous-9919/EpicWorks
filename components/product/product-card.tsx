"use client";

import Link from "next/link";
import { ShoppingBag, Star, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardImage, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKWD } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import type { Product } from "@/types";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { locale } = useLocale();
  const { addItem, updateQuantity, removeItem, getItemQuantity } = useCartStore();
  const cartQty = getItemQuantity(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group relative">
        <Link href={`/products/${product.slug}`}>
          <div className="relative overflow-hidden">
            <CardImage
              src={product.images[0]}
              alt={product.name}
              className="h-52 md:h-60"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.onSale && <Badge variant="sale">{t("badge.sale", locale)}</Badge>}
              {product.featured && <Badge variant="new">{t("badge.featured", locale)}</Badge>}
            </div>
            {!product.inStock && (
              <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
                <Badge variant="stock" className="bg-accent text-white">{t("badge.out-of-stock", locale)}</Badge>
              </div>
            )}
          </div>
        </Link>

        <CardBody>
          <Link href={`/products/${product.slug}`}>
            <p className="text-xs text-secondary font-medium uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-semibold text-text text-sm leading-snug mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
            <span className="text-xs font-medium text-text">{product.rating}</span>
            <span className="text-xs text-text-muted">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-text">{formatKWD(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-text-muted line-through">{formatKWD(product.originalPrice)}</span>
              )}
            </div>
            {mounted ? (
              <AnimatePresence mode="wait">
                {cartQty > 0 ? (
                  <motion.div
                    key="stepper"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center rounded-lg bg-secondary/10 border border-secondary/20"
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (cartQty <= 1) {
                          removeItem(product.id);
                        } else {
                          updateQuantity(product.id, cartQty - 1);
                        }
                      }}
                      className="p-2.5 hover:text-secondary transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <motion.span
                      key={cartQty}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="w-7 text-center font-bold text-secondary text-xs"
                    >
                      {cartQty}
                    </motion.span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        updateQuantity(product.id, cartQty + 1);
                      }}
                      className="p-2.5 hover:text-secondary transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      size="md"
                      variant="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        addItem({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.images[0],
                          slug: product.slug,
                        });
                      }}
                      disabled={!product.inStock}
                      className="!px-3"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <Button
                size="md"
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  addItem({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    slug: product.slug,
                  });
                }}
                disabled={!product.inStock}
                className="!px-3"
              >
                <ShoppingBag className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
