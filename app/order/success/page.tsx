import { Suspense } from "react";
import { OrderSuccessContent } from "./content";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 rounded-full bg-surface-light animate-pulse mx-auto mb-4" />
        <div className="h-6 bg-surface-light rounded-lg w-48 mx-auto mb-2 animate-pulse" />
        <div className="h-4 bg-surface-light rounded-lg w-64 mx-auto animate-pulse" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
