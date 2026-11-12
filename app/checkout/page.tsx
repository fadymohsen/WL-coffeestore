"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import HeaderNav from "@/components/layout/HeaderNav";
import CartDrawer from "@/components/layout/CartDrawer";
import OrderSummary from "@/components/shop/OrderSummary";
import { LineSkeleton } from "@/components/shop/CartLines";
import { useBagReady, useCartLines } from "@/lib/cart";
import { useCatalogStore, type Order } from "@/store/useCatalogStore";
import { useShopStore } from "@/store/useShopStore";
import { useLocalized } from "@/lib/i18n";
import { SplitText } from "@/components/ui/motion";

type Form = { name: string; phone: string; email: string; address: string; city: string; notes: string };
const EMPTY: Form = { name: "", phone: "", email: "", address: "", city: "", notes: "" };

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="block text-sm font-semibold text-green">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span id={`${id}-err`} role="alert" className="mt-1 block text-xs font-normal text-[#A8322F]">{error}</span>}
    </div>
  );
}

const inputCls = (bad: boolean) =>
  `mt-1.5 w-full rounded-xl border bg-n100 px-4 py-3 text-sm font-normal text-ink outline-none transition focus:ring-2 ${bad ? "border-[#A8322F] focus:ring-[#A8322F]/20" : "border-n300 focus:border-green focus:ring-green/20"}`;

export default function CheckoutPage() {
  const l = useLocalized();
  const { lines, subtotal, blocked, promo, discountAmount, shipping, total } = useCartLines();
  const promoCode = useShopStore((s) => s.promo);
  const setShipCity = useShopStore((s) => s.setShipCity);
  const hydrated = useBagReady();
  const placeOrder = useCatalogStore((s) => s.placeOrder);
  const clearCart = useShopStore((s) => s.clearCart);

  const [form, setForm] = useState<Form>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Order | null>(null);

  const digits = form.phone.replace(/\D/g, "");
  const errors: Partial<Record<keyof Form, string>> = {
    name: form.name.trim().length < 2 ? l({ en: "Enter your full name.", ar: "اكتب اسمك بالكامل." }) : undefined,
    phone: digits.length < 10 || digits.length > 15 ? l({ en: "Enter a phone number we can reach.", ar: "اكتب رقم هاتف يمكننا الاتصال بك عليه." }) : undefined,
    email: form.email && !/^\S+@\S+\.\S+$/.test(form.email) ? l({ en: "That email does not look right.", ar: "تأكد من كتابة البريد الإلكتروني بشكل صحيح." }) : undefined,
    city: form.city.trim().length < 2 ? l({ en: "Enter your city.", ar: "اكتب مدينتك." }) : undefined,
    address: form.address.trim().length < 6 ? l({ en: "Enter your street and building.", ar: "اكتب الشارع ورقم العقار." }) : undefined,
  };
  const valid = !Object.values(errors).some(Boolean);
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });
  const blur = (k: keyof Form) => () => setTouched({ ...touched, [k]: true });
  const err = (k: keyof Form) => (touched[k] ? errors[k] : undefined);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, city: true, address: true });
    if (!valid || blocked || lines.length === 0) {
      // send the keyboard to the first field that needs attention
      window.setTimeout(() => document.querySelector<HTMLElement>('form [aria-invalid="true"]')?.focus(), 0);
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      const order = placeOrder({
        customer: { ...form, name: form.name.trim() },
        lines: lines.map((x) => ({ key: x.key, name: x.item.name, variant: x.variant.label, qty: x.qty, price: x.variant.price })),
        subtotal,
        discount: promo?.ok && promoCode ? { code: promoCode.toUpperCase(), amount: discountAmount } : null,
        shipping: shipping ? { label: shipping.rate.name, price: shipping.price } : null,
        total,
      });
      clearCart();
      setDone(order);
      setBusy(false);
      window.scrollTo({ top: 0 });
    }, 900);
  };

  return (
    <main id="main" className="page-in relative min-h-screen bg-sandy">
      <HeaderNav />
      <CartDrawer />

      <section className="mx-auto max-w-[1100px] px-5 pb-24 pt-32 md:px-10 md:pt-40">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green text-sandy"><Check className="h-8 w-8" /></span>
              <h1 className="mt-6 font-editorial text-4xl font-semibold text-green md:text-5xl">{l({ en: "Thank you, your order is in", ar: "وصلنا طلبك، شكراً لك" })}</h1>
              <p className="mt-4 text-n500">
                {l({ en: "Order", ar: "رقم الطلب" })} <bdi className="font-semibold text-green">{done.id}</bdi>.{" "}
                {l({ en: "We will call you on", ar: "سنتصل بك على" })} <bdi dir="ltr">{done.customer.phone}</bdi> {l({ en: "to confirm delivery. You pay in cash when it arrives.", ar: "لتأكيد موعد التوصيل. تدفع نقداً عند الاستلام." })}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/shop" className="btn btn-primary">{l({ en: "Keep shopping", ar: "متابعة التسوق" })}</Link>
                <Link href="/" className="btn btn-ghost">{l({ en: "Back home", ar: "الرئيسية" })}</Link>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SplitText as="h1" text={l({ en: "Checkout", ar: "إتمام الطلب" })} className="block font-editorial text-4xl font-semibold text-green md:text-6xl" />

              {!hydrated ? (
                <div className="mt-10 space-y-3"><LineSkeleton /><LineSkeleton /></div>
              ) : lines.length === 0 ? (
                <div className="mt-12 rounded-2xl border border-n200 bg-n100 px-6 py-16 text-center">
                  <p className="font-editorial text-2xl font-semibold text-green">{l({ en: "Your bag is empty", ar: "السلة فارغة" })}</p>
                  <Link href="/shop" className="btn btn-primary mt-5">{l({ en: "Browse the shop", ar: "تصفّح المتجر" })}</Link>
                </div>
              ) : (
                <form onSubmit={submit} noValidate aria-label={l({ en: "Checkout", ar: "إتمام الطلب" })} className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
                  <div className="space-y-10">
                    <fieldset>
                      <legend className="mb-4 font-editorial text-2xl font-semibold text-green">{l({ en: "Contact", ar: "بيانات التواصل" })}</legend>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field id="f-name" label={l({ en: "Full name", ar: "الاسم بالكامل" })} error={err("name")}>
                          <input value={form.name} onChange={set("name")} id="f-name" aria-invalid={!!err("name")} aria-describedby={err("name") ? "f-name-err" : undefined} onBlur={blur("name")} autoComplete="name" className={inputCls(!!err("name"))} />
                        </Field>
                        <Field id="f-phone" label={l({ en: "Phone", ar: "رقم الهاتف" })} error={err("phone")}>
                          <input value={form.phone} onChange={set("phone")} id="f-phone" aria-invalid={!!err("phone")} aria-describedby={err("phone") ? "f-phone-err" : undefined} onBlur={blur("phone")} type="tel" dir="ltr" autoComplete="tel" inputMode="tel" className={inputCls(!!err("phone"))} />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field id="f-email" label={l({ en: "Email (optional)", ar: "البريد الإلكتروني (اختياري)" })} error={err("email")}>
                            <input value={form.email} onChange={set("email")} id="f-email" aria-invalid={!!err("email")} aria-describedby={err("email") ? "f-email-err" : undefined} onBlur={blur("email")} type="email" dir="ltr" autoComplete="email" className={inputCls(!!err("email"))} />
                          </Field>
                        </div>
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="mb-4 font-editorial text-2xl font-semibold text-green">{l({ en: "Delivery", ar: "التوصيل" })}</legend>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field id="f-city" label={l({ en: "City", ar: "المدينة" })} error={err("city")}>
                          <input value={form.city} onChange={(e) => { set("city")(e); setShipCity(e.target.value); }} id="f-city" aria-invalid={!!err("city")} aria-describedby={err("city") ? "f-city-err" : undefined} onBlur={blur("city")} autoComplete="address-level2" className={inputCls(!!err("city"))} />
                        </Field>
                        <Field id="f-address" label={l({ en: "Street and building", ar: "الشارع والعقار" })} error={err("address")}>
                          <input value={form.address} onChange={set("address")} id="f-address" aria-invalid={!!err("address")} aria-describedby={err("address") ? "f-address-err" : undefined} onBlur={blur("address")} autoComplete="street-address" className={inputCls(!!err("address"))} />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field id="f-notes" label={l({ en: "Delivery notes (optional)", ar: "ملاحظات التوصيل (اختياري)" })}>
                            <textarea id="f-notes" rows={3} value={form.notes} onChange={set("notes")} className={inputCls(false)} />
                          </Field>
                        </div>
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="mb-4 font-editorial text-2xl font-semibold text-green">{l({ en: "Payment", ar: "الدفع" })}</legend>
                      <label className="flex items-start gap-3 rounded-xl border-2 border-green bg-n100 p-4">
                        <input type="radio" checked readOnly className="mt-1 h-4 w-4 accent-[#0E3A33]" />
                        <span>
                          <span className="block font-semibold text-green">{l({ en: "Cash on delivery", ar: "الدفع عند الاستلام" })}</span>
                          <span className="text-sm text-n500">{l({ en: "Pay the courier when your order arrives. Online payment is not available yet.", ar: "تدفع للمندوب عند وصول الطلب. الدفع الإلكتروني غير متاح حتى الآن." })}</span>
                        </span>
                      </label>
                    </fieldset>
                  </div>

                  <aside className="h-fit rounded-2xl border border-n200 bg-n100 p-6 lg:sticky lg:top-28">
                    <h2 className="mb-4 font-editorial text-2xl font-semibold text-green">{l({ en: "Your order", ar: "طلبك" })}</h2>
                    <OrderSummary showItems />
                    {blocked && <p role="alert" className="mt-3 text-xs text-[#A8322F]">{l({ en: "Some items are unavailable. Review your bag.", ar: "بعض المنتجات لم تعد متوفرة. راجع سلتك." })}</p>}
                    <button type="submit" disabled={busy || blocked} className="btn btn-primary mt-5 w-full disabled:opacity-60">
                      {busy ? (<><Loader2 className="h-4 w-4 animate-spin" />{l({ en: "Placing order", ar: "جارٍ تأكيد الطلب" })}</>) : l({ en: "Place order", ar: "تأكيد الطلب" })}
                    </button>
                    <Link href="/cart" className="mt-3 block text-center text-sm font-medium text-green hover:underline">{l({ en: "Edit bag", ar: "تعديل السلة" })}</Link>
                  </aside>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
