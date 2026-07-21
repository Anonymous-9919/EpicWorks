"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, Star, Check, Minus, Plus, Shield, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatKWD } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import type { Product } from "@/types";

export default function ProductDetailClient({
  product: rawProduct,
  related: rawRelated,
}: {
  product: Product;
  related: Product[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { locale } = useLocale();

  const product = useMemo(() => {
    const images = rawProduct.images.length > 0 ? rawProduct.images : ["/placeholder.png"];
    return {
      ...rawProduct,
      images,
      name: locale === "ar" ? (rawProduct.nameAr || rawProduct.name) : rawProduct.name,
      description: locale === "ar" ? (rawProduct.descriptionAr || rawProduct.description) : rawProduct.description,
      category: locale === "ar" ? (rawProduct.categoryAr || rawProduct.category) : rawProduct.category,
    };
  }, [rawProduct, locale]);

  const related = useMemo(() => rawRelated.map((p) => ({
    ...p,
    name: locale === "ar" ? (p.nameAr || p.name) : p.name,
    category: locale === "ar" ? (p.categoryAr || p.category) : p.category,
  })), [rawRelated, locale]);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, updateQuantity, removeItem, getItemQuantity } = useCartStore();
  const cartQty = product ? getItemQuantity(product.id) : 0;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted text-lg">{t("product-detail.not-found", locale)}</p>
        <Link href="/products"><Button variant="primary" className="mt-4">{t("product-detail.back", locale)}</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Back */}
      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-secondary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t("product-detail.back", locale)}
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-12">
        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="relative rounded-2xl overflow-hidden bg-surface border border-border mb-3">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full aspect-[4/3] object-contain bg-surface-light"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.onSale && <Badge variant="sale">{t("badge.sale", locale)}</Badge>}
              {!product.inStock && <Badge variant="stock" className="bg-accent text-white">{t("badge.out-of-stock", locale)}</Badge>}
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                  selectedImage === i ? "border-secondary" : "border-border hover:border-secondary/50"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Badge variant="category">{product.category}</Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-text mt-3 mb-3">{product.name}</h1>

          <div className="flex items-center gap-1.5 mb-4">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-text-muted">({product.reviewCount} {t("product-detail.reviews", locale)})</span>
          </div>

          <p className="text-text-muted text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Pricing */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-extrabold text-text">{formatKWD(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-text-muted line-through">{formatKWD(product.originalPrice)}</span>
            )}
            {product.onSale && product.originalPrice && product.originalPrice > 0 && (
              <Badge variant="sale">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Specs */}
          {product.specs && (
            <div className="space-y-2 mb-6">
              {product.specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-text-muted">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  {spec}
                </div>
              ))}
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            {mounted ? (
              <>
                <AnimatePresence mode="wait">
                  {cartQty > 0 ? (
                    <motion.div
                      key="cart-stepper"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center rounded-xl bg-secondary/10 border border-secondary/20"
                    >
                      <button
                        onClick={() => {
                          if (cartQty <= 1) {
                            removeItem(product.id);
                          } else {
                            updateQuantity(product.id, cartQty - 1);
                          }
                        }}
                        className="p-3 hover:text-secondary transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <motion.span
                        key={cartQty}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-10 text-center font-bold text-secondary text-sm"
                      >
                        {cartQty}
                      </motion.span>
                      <button
                        onClick={() => updateQuantity(product.id, cartQty + 1)}
                        className="p-3 hover:text-secondary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="local-stepper"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center rounded-xl bg-surface-light/50 border border-border"
                    >
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-secondary transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium text-sm">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-secondary transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {cartQty > 0 ? (
                    <motion.div
                      key="view-cart"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1"
                    >
                      <Button
                        size="lg"
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          useCartStore.getState().setCartDrawerOpen(true);
                        }}
                      >
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        {t("cart.view-in-cart", locale)} ({cartQty})
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add-cart"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1"
                    >
                      <Button
                        size="lg"
                        variant="primary"
                        disabled={!product.inStock}
                        className="w-full"
                        onClick={() => {
                          for (let i = 0; i < quantity; i++) {
                            addItem({
                              productId: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.images[0],
                              slug: product.slug,
                            });
                          }
                        }}
                      >
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        {product.inStock ? t("product-detail.add-to-cart", locale) : t("badge.out-of-stock", locale)}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <div className="flex items-center rounded-xl bg-surface-light/50 border border-border">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-secondary transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-secondary transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  size="lg"
                  variant="primary"
                  disabled={!product.inStock}
                  className="flex-1"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addItem({
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        slug: product.slug,
                      });
                    }
                  }}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {product.inStock ? t("product-detail.add-to-cart", locale) : t("badge.out-of-stock", locale)}
                </Button>
              </>
            )}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-border">
            {[
              { icon: Shield, key: "secure-payment" },
              { icon: Truck, key: "mobile-service" },
              { icon: RotateCcw, key: "satisfaction" },
            ].map((item) => (
              <div key={item.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                <item.icon className="w-5 h-5 text-secondary shrink-0 sm:mx-auto sm:mb-1" />
                <div>
                  <p className="text-xs font-medium text-text">{t(`trust.${item.key}`, locale)}</p>
                  <p className="text-xs text-text-muted">{t(`trust.${item.key}-desc`, locale)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-text mb-6">{t("product-detail.related", locale)}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p, i) => (
              <Link key={p.id} href={`/products/${p.slug}`}>
                <div className="rounded-2xl bg-surface border border-border overflow-hidden hover:border-secondary/30 transition-all duration-300 group">
                  <img src={p.images[0]} alt={p.name} className="w-full h-36 object-contain bg-surface-light" />
                  <div className="p-3">
                    <p className="text-xs text-text-muted">{p.category}</p>
                    <h3 className="text-sm font-semibold text-text mt-0.5 line-clamp-1">{p.name}</h3>
                    <p className="text-sm font-bold text-secondary mt-1">{formatKWD(p.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
