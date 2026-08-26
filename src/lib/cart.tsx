"use client";

import { createContext, useContext, useEffect, useOptimistic, useReducer, useRef, useState, startTransition, type ReactNode } from "react";
import type { Product, Variant } from "@/lib/types";

export type CartItem = { uid: string; name: string; image?: string; variant: Variant; quantity: number };
type Action = { type: "add"; item: CartItem } | { type: "remove"; key: string } | { type: "update"; key: string; quantity: number } | { type: "clear" } | { type: "hydrate"; items: CartItem[] };
type CartContextValue = { items: CartItem[]; count: number; add: (product: Product, variant: Variant) => void; remove: (key: string) => void; update: (key: string, quantity: number) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);
const keyOf = (item: CartItem) => `${item.uid}-${item.variant.posItemCode ?? item.variant.ebsItemCode ?? "default"}`;
function reducer(items: CartItem[], action: Action): CartItem[] {
  if (action.type === "hydrate") return action.items;
  if (action.type === "clear") return [];
  if (action.type === "remove") return items.filter((item) => keyOf(item) !== action.key);
  if (action.type === "update") return action.quantity < 1 ? items.filter((item) => keyOf(item) !== action.key) : items.map((item) => keyOf(item) === action.key ? { ...item, quantity: Math.min(action.quantity, item.variant.quantity ?? action.quantity) } : item);
  const existing = items.find((item) => keyOf(item) === keyOf(action.item));
  return existing ? items.map((item) => keyOf(item) === keyOf(action.item) ? { ...item, quantity: Math.min(item.quantity + 1, item.variant.quantity ?? item.quantity + 1) } : item) : [...items, action.item];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const hydrationStarted = useRef(false);
  const [hydrationComplete, setHydrationComplete] = useState(false);
  const [optimisticItems, setOptimisticItems] = useOptimistic(items, reducer);
  useEffect(() => {
    if (hydrationStarted.current) return;
    hydrationStarted.current = true;
    try {
      const stored = localStorage.getItem("walton-cart:v1") ?? localStorage.getItem("walton-cart");
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        const valid = parsed.filter((item) => item?.uid && item?.variant && Number.isFinite(item.quantity) && item.quantity > 0).map((item) => ({ ...item, quantity: Math.max(1, Math.floor(item.quantity)) }));
        dispatch({ type: "hydrate", items: valid });
      }
    } catch { /* storage is optional */ }
    window.setTimeout(() => setHydrationComplete(true), 0);
  }, []);
  useEffect(() => { if (hydrationComplete) localStorage.setItem("walton-cart:v1", JSON.stringify(items)); }, [items, hydrationComplete]);
  const add = (product: Product, variant: Variant) => { const item = { uid: product.uid, name: product.enName ?? "Walton product", image: product.images?.[0]?.url ?? undefined, variant, quantity: 1 }; const action: Action = { type: "add", item }; startTransition(() => { setOptimisticItems(action); dispatch(action); }); };
  const clear = () => { dispatch({ type: "clear" }); localStorage.removeItem("walton-cart:v1"); localStorage.removeItem("walton-cart"); };
  const value = { items: optimisticItems, count: optimisticItems.reduce((sum, item) => sum + item.quantity, 0), add, remove: (key: string) => dispatch({ type: "remove", key }), update: (key: string, quantity: number) => dispatch({ type: "update", key, quantity }), clear };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used within CartProvider"); return context; }
export { keyOf };
