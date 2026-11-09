"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { ArrowUpRight, Check } from "lucide-react";
import HeaderNav from "@/components/layout/HeaderNav";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/motion";
import { useCatalogStore } from "@/store/useCatalogStore";
import { useLocalized } from "@/lib/i18n";

const field =
  "mt-2 w-full rounded-[10px] border border-n300 bg-n100 px-4 py-3 text-sm text-ink outline-none transition focus:border-green focus:ring-2 focus:ring-green/20";

const TOPICS = [
  { id: "recommend", en: "Recommend a blend", ar: "ترشيح توليفة" },
  { id: "order", en: "My order", ar: "طلبي" },
  { id: "gift", en: "Gifts and packaging", ar: "الهدايا والتغليف" },
  { id: "other", en: "Something else", ar: "شيء آخر" },
];

export default function ContactPage() {
  const l = useLocalized();
  const addMessage = useCatalogStore((s) => s.addMessage);
  const settings = useCatalogStore((s) => s.settings);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", topic: "recommend", body: "" });

  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState(false);
  const c = form.contact.trim();
  const contactOk = /^\S+@\S+\.\S+$/.test(c) || c.replace(/\D/g, "").length >= 10;
  const contactErr = touched && !contactOk ? l({ en: "Enter a phone number or an email we can reply to.", ar: "اكتب رقم هاتف أو بريداً إلكترونياً نرد عليه." }) : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!contactOk) {
      window.setTimeout(() => document.getElementById("c-contact")?.focus(), 0);
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      addMessage(form);
      setSent(true);
      setBusy(false);
    }, 600);
  };

  return (
    <main id="main" className="page-in relative">
      <HeaderNav />
      <CartDrawer />

      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 md:px-20 md:pt-40">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <Reveal>
            <p className="font-latin text-sm tracking-[0.3em] text-aqeeq">{l({ en: "CONTACT", ar: "تواصل معنا" })}</p>
            <SplitText as="h1" text={l({ en: "Tell us what you like", ar: "قل لنا ما الذي تحبه" })} className="mt-2 block font-editorial text-5xl font-semibold leading-tight text-green md:text-7xl" />
            <p className="mt-5 max-w-md text-base leading-relaxed text-n500">
              {l({
                en: "If you'd like a blend recommended for your brewing method and taste, send us a message and we will help you directly.",
                ar: "لو تحب نرشح لك توليفة حسب طريقة التحضير والذوق، ابعت لنا وسنساعدك مباشرة.",
              })}
            </p>

            <dl className="mt-10 space-y-6 border-t border-n200 pt-8">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.22em] text-n400">{l({ en: "Instagram", ar: "إنستجرام" })}</dt>
                <dd className="mt-1">
                  <a href="https://instagram.com/diwan_eg" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-lg font-medium text-green">
                    <bdi>@diwan_eg</bdi>
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 rtl:-scale-x-100" />
                  </a>
                </dd>
              </div>
              {settings.whatsapp && (
                <div>
                  <dt className="text-sm text-n400">WhatsApp</dt>
                  <dd className="mt-1"><a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" dir="ltr" className="text-lg font-medium text-green hover:underline">{settings.whatsapp}</a></dd>
                </div>
              )}
              {settings.phone && (
                <div>
                  <dt className="text-sm text-n400">{l({ en: "Phone", ar: "الهاتف" })}</dt>
                  <dd className="mt-1"><a href={`tel:${settings.phone}`} dir="ltr" className="text-lg font-medium text-green hover:underline">{settings.phone}</a></dd>
                </div>
              )}
              {settings.supportEmail && (
                <div>
                  <dt className="text-sm text-n400">{l({ en: "Email", ar: "البريد" })}</dt>
                  <dd className="mt-1"><a href={`mailto:${settings.supportEmail}`} dir="ltr" className="text-lg font-medium text-green hover:underline">{settings.supportEmail}</a></dd>
                </div>
              )}
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.22em] text-n400">{l({ en: "Based in", ar: "نحن في" })}</dt>
                <dd className="mt-1 text-lg font-medium text-green">{l({ en: "Cairo, Egypt", ar: "القاهرة، مصر" })}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.22em] text-n400">{l({ en: "Support", ar: "الدعم" })}</dt>
                <dd className="mt-1 max-w-sm text-sm leading-relaxed text-n500">
                  {l({
                    en: "We review the experience with you quickly, address the cause of the problem and suggest a suitable alternative.",
                    ar: "نراجع التجربة معك بسرعة، ونعالج سبب المشكلة، ونقترح بديلاً مناسباً.",
                  })}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[14px] border border-n200 bg-n100 p-6 md:p-10">
              {sent ? (
                <div className="flex min-h-[22rem] flex-col items-center justify-center gap-3 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-green text-sandy"><Check className="h-7 w-7" /></span>
                  <h2 className="font-editorial text-3xl font-semibold text-green">{l({ en: "Message received", ar: "وصلت رسالتك" })}</h2>
                  <p className="max-w-sm text-sm text-n500">{l({ en: "Thank you. We will get back to you soon.", ar: "شكراً لك. سنرد عليك قريباً." })}</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", contact: "", topic: "recommend", body: "" }); }} className="btn btn-ghost mt-2">
                    {l({ en: "Send another", ar: "إرسال رسالة أخرى" })}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate aria-label={l({ en: "Contact form", ar: "نموذج التواصل" })} className="grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-green">
                    {l({ en: "Full name", ar: "الاسم بالكامل" })}
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} autoComplete="name" />
                  </label>
                  <label className="text-sm font-semibold text-green">
                    {l({ en: "Phone or email", ar: "الهاتف أو البريد" })}
                    <input id="c-contact" required dir="ltr" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} aria-invalid={!!contactErr} aria-describedby={contactErr ? "c-contact-err" : undefined} className={field} autoComplete="email" />
                    {contactErr && <span id="c-contact-err" role="alert" className="mt-1 block text-xs font-normal text-[#A8322F]">{contactErr}</span>}
                  </label>
                  <label className="text-sm font-semibold text-green sm:col-span-2">
                    {l({ en: "Topic", ar: "الموضوع" })}
                    <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className={field}>
                      {TOPICS.map((t) => (
                        <option key={t.id} value={t.id}>{l(t)}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-green sm:col-span-2">
                    {l({ en: "Message", ar: "رسالتك" })}
                    <textarea required rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className={field} />
                  </label>
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={busy} className="btn btn-primary w-full sm:w-auto">{busy ? (<><Loader2 className="h-4 w-4 animate-spin" />{l({ en: "Sending", ar: "جارٍ الإرسال" })}</>) : l({ en: "Send message", ar: "إرسال الرسالة" })}</button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
