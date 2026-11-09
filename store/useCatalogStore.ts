"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Bi, type CategoryId } from "@/data/products";

export interface CatalogVariant {
  key: string;
  label: Bi;
  sku: string;
  /** EGP per pack */
  price: number;
  /** Original price shown struck through, when set */
  compareAt: number | null;
  /** Unit cost, used for margin and stock value */
  cost: number | null;
  /** null = not tracked */
  stock: number | null;
  /** Alert when stock falls to this number or below */
  threshold: number;
}

export type ProductStatus = "active" | "draft" | "archived";

export interface CatalogItem {
  id: string;
  name: Bi;
  description: Bi;
  categoryId: CategoryId;
  hex: string;
  image: string;
  status: ProductStatus;
  tags: string[];
  variants: CatalogVariant[];
}

export type OrderStatus = "new" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";

export interface OrderLine {
  key: string;
  name: Bi;
  variant: Bi;
  qty: number;
  price: number;
}

export interface TimelineEvent {
  status: OrderStatus | "paid" | "note";
  at: number;
  note?: string;
}

export type DiscountType = "percent" | "fixed" | "shipping";

export interface Discount {
  id: string;
  code: string;
  type: DiscountType;
  /** percent (1-100), or EGP off for "fixed"; ignored for free shipping */
  value: number;
  minSubtotal: number;
  /** null = unlimited */
  usageLimit: number | null;
  used: number;
  startsAt: number | null;
  endsAt: number | null;
  /** "all" or a category id */
  scope: "all" | CategoryId;
  active: boolean;
  note: string;
}

export interface ShippingRate {
  id: string;
  name: Bi;
  /** City names this rate covers (lowercase match). "*" covers everywhere else. */
  cities: string[];
  price: number;
  /** Free shipping at or above this subtotal. null = never free. */
  freeOver: number | null;
  eta: Bi;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  whatsapp: string;
  supportEmail: string;
  orderPrefix: string;
}

export interface Refund {
  id: string;
  at: number;
  amount: number;
  reason: string;
  restocked: boolean;
}

export interface Order {
  id: string;
  createdAt: number;
  source: "web" | "draft";
  customer: { name: string; phone: string; email: string; address: string; city: string; notes: string };
  lines: OrderLine[];
  subtotal: number;
  discount: { code: string; amount: number } | null;
  shipping: { label: Bi; price: number } | null;
  total: number;
  refunds: Refund[];
  status: OrderStatus;
  payment: { method: "cod"; paid: boolean };
  tracking: { courier: string; number: string };
  /** Internal, never shown to the customer */
  internalNote: string;
  timeline: TimelineEvent[];
}

export type AdjustReason = "restock" | "correction" | "damaged" | "return" | "order";

export interface Adjustment {
  id: string;
  at: number;
  itemId: string;
  variantKey: string;
  delta: number;
  reason: AdjustReason;
  note: string;
}

export interface Message {
  id: string;
  createdAt: number;
  name: string;
  contact: string;
  topic: string;
  body: string;
  read: boolean;
}

const sku = (id: string, key: string) => `DW-${id.toUpperCase().slice(0, 4)}-${key === "default" ? "200" : key.split("-").map((x) => x.slice(0, 3).toUpperCase()).join("")}`;

const seed = (): CatalogItem[] =>
  PRODUCTS.map((p) => ({
    id: p.id,
    name: { ar: p.name, en: p.nameEn },
    description: { ar: p.copy, en: p.copyEn },
    categoryId: p.categoryId,
    hex: p.hex,
    image: p.image,
    status: "active",
    tags: [],
    variants: p.variants.map((v) => ({ ...v, sku: sku(p.id, v.key), compareAt: null, cost: null, stock: null, threshold: 5 })),
  }));

export type NewOrder = Pick<Order, "customer" | "lines" | "subtotal" | "discount" | "shipping" | "total"> & { source?: "web" | "draft" };

interface CatalogState {
  items: CatalogItem[];
  orders: Order[];
  messages: Message[];
  adjustments: Adjustment[];
  discounts: Discount[];
  shippingRates: ShippingRate[];
  settings: StoreSettings;
  upsertDiscount: (d: Discount) => void;
  deleteDiscount: (id: string) => void;
  upsertRate: (r: ShippingRate) => void;
  deleteRate: (id: string) => void;
  updateSettings: (patch: Partial<StoreSettings>) => void;
  refundOrder: (id: string, amount: number, reason: string, restock: boolean) => void;
  addMessage: (m: Omit<Message, "id" | "createdAt" | "read">) => void;
  markMessageRead: (id: string) => void;
  upsertItem: (item: CatalogItem) => void;
  deleteItem: (id: string) => void;
  setVariant: (id: string, key: string, patch: Partial<CatalogVariant>) => void;
  /** Change tracked stock by `delta` and log why */
  adjustStock: (id: string, key: string, delta: number, reason: AdjustReason, note?: string) => void;
  /** Set tracked stock to an exact number (or null to stop tracking) and log the difference */
  setStock: (id: string, key: string, stock: number | null, note?: string) => void;
  resetCatalog: () => void;
  placeOrder: (input: NewOrder) => Order;
  updateOrder: (id: string, patch: Partial<Pick<Order, "tracking" | "internalNote">>) => void;
  setOrderStatus: (id: string, status: OrderStatus, note?: string) => void;
  setOrderPaid: (id: string, paid: boolean) => void;
}

const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      items: seed(),
      orders: [],
      messages: [],
      adjustments: [],
      discounts: [],
      shippingRates: [],
      settings: { storeName: "DIWAN", phone: "", whatsapp: "", supportEmail: "", orderPrefix: "DW" },
      upsertDiscount: (d) => set((s) => ({ discounts: s.discounts.some((x) => x.id === d.id) ? s.discounts.map((x) => (x.id === d.id ? d : x)) : [d, ...s.discounts] })),
      deleteDiscount: (id) => set((s) => ({ discounts: s.discounts.filter((x) => x.id !== id) })),
      upsertRate: (r) => set((s) => ({ shippingRates: s.shippingRates.some((x) => x.id === r.id) ? s.shippingRates.map((x) => (x.id === r.id ? r : x)) : [...s.shippingRates, r] })),
      deleteRate: (id) => set((s) => ({ shippingRates: s.shippingRates.filter((x) => x.id !== id) })),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      refundOrder: (id, amount, reason, restock) => {
        const order = get().orders.find((o) => o.id === id);
        if (!order) return;
        const at = Date.now();
        set((s) => {
          const log: Adjustment[] = [];
          let items = s.items;
          if (restock) {
            items = s.items.map((i) => ({
              ...i,
              variants: i.variants.map((v) => {
                const line = order.lines.find((l) => l.key === `${i.id}:${v.key}`);
                if (!line || v.stock === null) return v;
                log.push({ id: uid("ADJ"), at, itemId: i.id, variantKey: v.key, delta: line.qty, reason: "return", note: id });
                return { ...v, stock: v.stock + line.qty };
              }),
            }));
          }
          return {
            items,
            adjustments: [...log, ...s.adjustments],
            orders: s.orders.map((o) =>
              o.id === id
                ? {
                    ...o,
                    refunds: [...o.refunds, { id: uid("RF"), at, amount, reason, restocked: restock }],
                    timeline: [...o.timeline, { status: "note" as const, at, note: `Refund ${amount} EGP${reason ? ": " + reason : ""}` }],
                  }
                : o,
            ),
          };
        });
      },
      addMessage: (m) =>
        set((s) => ({ messages: [{ ...m, id: `MSG-${s.messages.length + 1}`, createdAt: Date.now(), read: false }, ...s.messages] })),
      markMessageRead: (id) => set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, read: true } : m)) })),
      upsertItem: (item) =>
        set((s) =>
          s.items.some((i) => i.id === item.id)
            ? { items: s.items.map((i) => (i.id === item.id ? item : i)) }
            : { items: [...s.items, item] },
        ),
      deleteItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setVariant: (id, key, patch) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, variants: i.variants.map((v) => (v.key === key ? { ...v, ...patch } : v)) } : i,
          ),
        })),
      adjustStock: (id, key, delta, reason, note = "") =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id !== id
              ? i
              : {
                  ...i,
                  variants: i.variants.map((v) =>
                    v.key === key && v.stock !== null ? { ...v, stock: Math.max(0, v.stock + delta) } : v,
                  ),
                },
          ),
          adjustments: [{ id: uid("ADJ"), at: Date.now(), itemId: id, variantKey: key, delta, reason, note }, ...s.adjustments],
        })),
      setStock: (id, key, stock, note = "") => {
        const item = get().items.find((i) => i.id === id);
        const v = item?.variants.find((x) => x.key === key);
        if (!v) return;
        const delta = stock === null || v.stock === null ? 0 : stock - v.stock;
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, variants: i.variants.map((x) => (x.key === key ? { ...x, stock } : x)) } : i,
          ),
          adjustments:
            delta !== 0
              ? [{ id: uid("ADJ"), at: Date.now(), itemId: id, variantKey: key, delta, reason: "correction" as const, note }, ...s.adjustments]
              : s.adjustments,
        }));
      },
      resetCatalog: () => set({ items: seed() }),
      placeOrder: (input) => {
        const now = Date.now();
        const order: Order = {
          ...input,
          source: input.source ?? "web",
          refunds: [],
          id: `${get().settings.orderPrefix || "DW"}-${String(get().orders.length + 1001)}`,
          createdAt: now,
          status: "new",
          payment: { method: "cod", paid: false },
          tracking: { courier: "", number: "" },
          internalNote: "",
          timeline: [{ status: "new", at: now }],
        };
        // tracked stock goes down when the order is placed
        set((s) => {
          const log: Adjustment[] = [];
          const items = s.items.map((i) => ({
            ...i,
            variants: i.variants.map((v) => {
              const line = input.lines.find((l) => l.key === `${i.id}:${v.key}`);
              if (!line || v.stock === null) return v;
              log.push({ id: uid("ADJ"), at: now, itemId: i.id, variantKey: v.key, delta: -line.qty, reason: "order", note: order.id });
              return { ...v, stock: Math.max(0, v.stock - line.qty) };
            }),
          }));
          const code = input.discount?.code.toLowerCase();
          const discounts = code ? s.discounts.map((d) => (d.code.toLowerCase() === code ? { ...d, used: d.used + 1 } : d)) : s.discounts;
          return { orders: [order, ...s.orders], items, discounts, adjustments: [...log, ...s.adjustments] };
        });
        return order;
      },
      updateOrder: (id, patch) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) })),
      setOrderStatus: (id, status, note) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, status, timeline: [...o.timeline, { status, at: Date.now(), note }] } : o,
          ),
        })),
      setOrderPaid: (id, paid) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id
              ? { ...o, payment: { ...o.payment, paid }, timeline: paid ? [...o.timeline, { status: "paid" as const, at: Date.now() }] : o.timeline }
              : o,
          ),
        })),
    }),
    { name: "diwan-catalog-v3", skipHydration: true },
  ),
);

export const lineKey = (productId: string, variantKey: string) => `${productId}:${variantKey}`;
export const isLive = (i: CatalogItem) => i.status === "active";

/** Resolve a cart line key to its catalog item and variant. */
export function resolveLine(items: CatalogItem[], key: string) {
  const [id, vk] = key.split(":");
  const item = items.find((i) => i.id === id);
  const variant = item?.variants.find((v) => v.key === vk);
  return item && variant ? { item, variant } : null;
}

export const inStock = (v: CatalogVariant) => v.stock === null || v.stock > 0;
export const isLow = (v: CatalogVariant) => v.stock !== null && v.stock > 0 && v.stock <= v.threshold;
