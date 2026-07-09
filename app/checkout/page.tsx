"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Landmark, Lock, ArrowLeft, Check, Calendar, Clock, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatKWD, generateId } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import type { PaymentMethod, CustomerInfo } from "@/types";

const initialCustomer: CustomerInfo = {
  name: "", email: "", phone: "", address: "", city: "Kuwait City", area: "",
  scheduledDate: "", scheduledTime: "",
};

const timeSlots = [
  { value: "morning", labelKey: "checkout.morning" },
  { value: "afternoon", labelKey: "checkout.afternoon" },
  { value: "evening", labelKey: "checkout.evening" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [customer, setCustomer] = useState<CustomerInfo>(initialCustomer);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("knet");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const days = locale === "ar"
    ? ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dateOptions = (() => {
    const opts: { value: string; label: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dayName = days[d.getDay()];
      const dateStr = d.toISOString().split("T")[0];
      const display = i === 0
        ? `${t("checkout.today", locale)} (${dayName})`
        : i === 1
        ? `${t("checkout.tomorrow", locale)} (${dayName})`
        : `${dayName} ${d.getDate()}/${d.getMonth() + 1}`;
      opts.push({ value: dateStr, label: display });
    }
    return opts;
  })();

  const validate = () => {
    const errs: typeof errors = {};
    if (!customer.name.trim()) errs.name = t("checkout.required", locale);
    if (!customer.email.trim()) errs.email = t("checkout.required", locale);
    if (!customer.phone.trim()) errs.phone = t("checkout.required", locale);
    if (!customer.address.trim()) errs.address = t("checkout.required", locale);
    if (!scheduledDate) errs.scheduledDate = t("checkout.required", locale);
    if (!scheduledTime) errs.scheduledTime = t("checkout.required", locale);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || items.length === 0) return;
    setLoading(true);

    try {
      const orderId = generateId();
      const mobile = customer.phone.startsWith("+") ? customer.phone : `+965${customer.phone.replace(/^0+/, "")}`;
      const body = {
        products: items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        order: {
          id: orderId,
          reference: orderId.slice(0, 12),
          description: `Epic Works ${scheduledDate} ${scheduledTime}`,
          currency: "KWD",
          amount: getSubtotal(),
        },
        paymentGateway: { src: paymentMethod },
        language: locale === "ar" ? "ar" : "en",
        reference: { id: orderId },
        customer: {
          uniqueId: customer.email,
          name: customer.name,
          email: customer.email,
          mobile,
        },
        returnUrl: `${window.location.origin}/order/success?order_id=${orderId}&date=${scheduledDate}&time=${scheduledTime}`,
        cancelUrl: `${window.location.origin}/checkout`,
        notificationUrl: `${window.location.origin}/api/webhook`,
      };

      const res = await fetch("/api/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.status && data.data?.link) {
        clearCart();
        window.location.href = data.data.link;
      } else {
        throw new Error(data.message || "Payment initiation failed");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert(t("checkout.failed", locale));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted text-lg mb-4">{t("cart.empty", locale)}</p>
        <Button variant="primary" onClick={() => router.push("/products")}>{t("nav.shop", locale)}</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-8">{t("checkout.title", locale)}</h1>

          <div className="grid md:grid-cols-5 gap-6 md:gap-8">
        {/* Form */}
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="md:col-span-3 space-y-5 md:space-y-6"
        >
          {/* Customer Info */}
          <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
            <h2 className="font-semibold text-text">{t("checkout.contact", locale)}</h2>
            <Input id="name" label={t("checkout.name", locale)} value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} error={errors.name} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input id="email" label={t("checkout.email", locale)} type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} error={errors.email} />
              <Input id="phone" label={t("checkout.phone", locale)} type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} error={errors.phone} />
            </div>
          </div>

          {/* Address */}
          <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
            <h2 className="font-semibold text-text">{t("checkout.address", locale)}</h2>
            <Input id="address" label={t("checkout.location", locale)} value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} error={errors.address} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input id="city" label={t("checkout.governorate", locale)} value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
              <Input id="area" label={t("checkout.landmark", locale)} value={customer.area} onChange={(e) => setCustomer({ ...customer, area: e.target.value })} />
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              <h2 className="font-semibold text-text">{t("checkout.schedule", locale)}</h2>
            </div>
            <p className="text-xs text-text-muted -mt-2">{t("checkout.schedule-desc", locale)}</p>

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-text mb-1.5 block">{t("checkout.date", locale)}</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {dateOptions.slice(0, 8).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setScheduledDate(opt.value)}
                    className={`text-center rounded-xl border-2 p-2.5 transition-all ${
                      scheduledDate === opt.value
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border hover:border-secondary/30 text-text-muted"
                    }`}
                  >
                    <span className="text-xs font-medium leading-tight block">{opt.label}</span>
                  </button>
                ))}
              </div>
              {errors.scheduledDate && <p className="text-xs text-accent mt-1">{errors.scheduledDate}</p>}
            </div>

            {/* Time */}
            <div>
              <label className="text-sm font-medium text-text mb-1.5 block">{t("checkout.time", locale)}</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => setScheduledTime(slot.value)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                      scheduledTime === slot.value
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border hover:border-secondary/30 text-text-muted"
                    }`}
                  >
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-medium">{t(slot.labelKey, locale)}</span>
                  </button>
                ))}
              </div>
              {errors.scheduledTime && <p className="text-xs text-accent mt-1">{errors.scheduledTime}</p>}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
            <h2 className="font-semibold text-text">{t("checkout.payment", locale)}</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("knet")}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  paymentMethod === "knet" ? "border-secondary bg-secondary/10" : "border-border hover:border-secondary/30"
                }`}
              >
                <Landmark className={`w-5 h-5 ${paymentMethod === "knet" ? "text-secondary" : "text-text-muted"}`} />
                <div className="text-left">
                  <p className="text-sm font-medium text-text">{t("checkout.knet", locale)}</p>
                  <p className="text-xs text-text-muted">{t("checkout.knet-desc", locale)}</p>
                </div>
                {paymentMethod === "knet" && <Check className="w-4 h-4 text-secondary ml-auto" />}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("credit-card")}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  paymentMethod === "credit-card" ? "border-secondary bg-secondary/10" : "border-border hover:border-secondary/30"
                }`}
              >
                <CreditCard className={`w-5 h-5 ${paymentMethod === "credit-card" ? "text-secondary" : "text-text-muted"}`} />
                <div className="text-left">
                  <p className="text-sm font-medium text-text">{t("checkout.credit-card", locale)}</p>
                  <p className="text-xs text-text-muted">{t("checkout.credit-desc", locale)}</p>
                </div>
                {paymentMethod === "credit-card" && <Check className="w-4 h-4 text-secondary ml-auto" />}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("apple-pay")}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  paymentMethod === "apple-pay" ? "border-secondary bg-secondary/10" : "border-border hover:border-secondary/30"
                }`}
              >
                <Smartphone className={`w-5 h-5 ${paymentMethod === "apple-pay" ? "text-secondary" : "text-text-muted"}`} />
                <div className="text-left">
                  <p className="text-sm font-medium text-text">{t("checkout.apple-pay", locale)}</p>
                  <p className="text-xs text-text-muted">{t("checkout.apple-pay-desc", locale)}</p>
                </div>
                {paymentMethod === "apple-pay" && <Check className="w-4 h-4 text-secondary ml-auto" />}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("google-pay")}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  paymentMethod === "google-pay" ? "border-secondary bg-secondary/10" : "border-border hover:border-secondary/30"
                }`}
              >
                <Wallet className={`w-5 h-5 ${paymentMethod === "google-pay" ? "text-secondary" : "text-text-muted"}`} />
                <div className="text-left">
                  <p className="text-sm font-medium text-text">{t("checkout.google-pay", locale)}</p>
                  <p className="text-xs text-text-muted">{t("checkout.google-pay-desc", locale)}</p>
                </div>
                {paymentMethod === "google-pay" && <Check className="w-4 h-4 text-secondary ml-auto" />}
              </button>
            </div>
            {paymentMethod === "knet" && (
              <p className="text-xs text-text-muted text-center">{t("checkout.test-card-note", locale)}</p>
            )}
            {paymentMethod === "credit-card" && (
              <p className="text-xs text-text-muted text-center">{t("checkout.test-card-cc", locale)}</p>
            )}
          </div>

          <Button type="submit" size="lg" variant="primary" className="w-full" loading={loading}>
            <Lock className="w-5 h-5 mr-2" />
            {t("cart.pay", locale)} {formatKWD(getSubtotal())}
          </Button>

          <p className="text-xs text-text-muted text-center flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> {t("checkout.secure", locale)}
          </p>
        </motion.form>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2"
        >
          <div className="bg-surface rounded-2xl border border-border p-5 sticky top-24">
            <h2 className="font-semibold text-text mb-4">{t("checkout.summary", locale)}</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text truncate">{item.name}</p>
                    <p className="text-xs text-text-muted">{t("checkout.qty", locale)}: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-text">{formatKWD(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{t("cart.subtotal", locale)}</span>
                <span className="text-text">{formatKWD(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{t("cart.service-fee", locale)}</span>
                <Badge variant="stock">{t("cart.free", locale)}</Badge>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span className="text-text">{t("cart.total", locale)}</span>
                <span className="text-secondary text-lg">{formatKWD(getSubtotal())}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
