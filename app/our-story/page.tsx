"use client";

import Link from "next/link";
import HeaderNav from "@/components/layout/HeaderNav";
import Footer from "@/components/layout/Footer";
import { useLocalized, translations } from "@/lib/i18n";

const t = translations.ourStory;

export default function OurStoryPage() {
  const l = useLocalized();

  return (
    <main className="relative">
      <HeaderNav />

      {/* Hero */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 pt-24 text-center md:px-20">
        <span className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-green/50">
          {l(t.label)}
        </span>
        <h1 className="font-editorial text-5xl font-bold text-green md:text-7xl">
          {l(t.label)}
        </h1>
        <p className="mt-2 text-lg text-n400">
          {l(t.subtitle)}
        </p>
      </section>

      {/* Brand Story */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-20">
        <div className="mx-auto max-w-2xl space-y-12">
          {/* The Diwan */}
          <div>
            <h2 className="font-editorial text-3xl font-bold text-green md:text-4xl">
              {l(t.diwanTitle)}
            </h2>
            <p className="mt-6 text-base leading-[1.9] text-n500">
              {l(t.diwanDescAr)}
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-n200" />
            <span className="text-sm text-n300">{l(translations.footer.tagline)}</span>
            <div className="h-px flex-1 bg-n200" />
          </div>

          {/* Purpose */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-aqeeq/70">
              {l(t.purposeLabel)}
            </span>
            <h3 className="mt-3 font-editorial text-2xl font-bold text-green">
              {l(t.purposeTitle)}
            </h3>
            <p className="mt-4 text-base leading-[1.9] text-n500">
              {l(t.purposeDesc)}
            </p>
          </div>

          {/* Promise */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-aqeeq/70">
              {l(t.promiseLabel)}
            </span>
            <h3 className="mt-3 font-editorial text-2xl font-bold text-green">
              {l(t.promiseTitle)}
            </h3>
            <p className="mt-4 text-base leading-[1.9] text-n500">
              {l(t.promiseDesc)}
            </p>
          </div>

          {/* Values */}
          <div className="grid gap-6 md:grid-cols-2">
            {t.values.map((value) => (
              <div
                key={value.title.en}
                className="rounded-[14px] border border-n200 bg-n100 p-6"
              >
                <h4 className="text-lg font-bold text-green">{l(value.title)}</h4>
                <p className="mt-3 text-sm leading-relaxed text-n500">
                  {l(value.desc)}
                </p>
              </div>
            ))}
          </div>

          {/* Personas */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-aqeeq/70">
              {l(t.forWhomLabel)}
            </span>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {t.personas.map((persona) => (
                <div
                  key={persona.name.en}
                  className="rounded-[10px] border border-n200 p-5"
                >
                  <h4 className="text-base font-bold text-green">
                    {l(persona.name)}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-n400">
                    {l(persona.desc)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 rounded-[14px] bg-green p-10 text-center">
            <h3 className="font-editorial text-2xl font-bold text-sandy md:text-3xl">
              {l(t.ctaTitle)}
            </h3>
            <Link
              href="/shop"
              className="mt-2 rounded-full bg-sandy px-8 py-3 text-sm font-semibold text-green transition hover:bg-sandy/90"
            >
              {l(t.ctaButton)}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
