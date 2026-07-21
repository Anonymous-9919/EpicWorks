"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const { locale } = useLocale();
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary/10 mb-4">
            <LogIn className="w-7 h-7 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-text">
            {t("login.title", locale)}
          </h1>
          <p className="text-text-muted mt-1 text-sm">
            {t("login.subtitle", locale)}
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text mb-1.5"
              >
                {t("login.email", locale)}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
                placeholder="admin@epicworks.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text mb-1.5"
              >
                {t("login.password", locale)}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-border bg-surface text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {state?.error && (
              <div className="text-accent text-sm bg-accent/10 rounded-xl px-4 py-2.5">
                {state.error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={pending}
              className="w-full"
            >
              {t("login.sign-in", locale)}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          <a
            href="/"
            className="hover:text-secondary transition-colors"
          >
            ← {t("login.back-to-site", locale)}
          </a>
        </p>
      </div>
    </div>
  );
}
