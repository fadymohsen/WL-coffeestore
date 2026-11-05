import type { Metadata } from "next";
import Link from "next/link";
import HeaderNav from "@/components/layout/HeaderNav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "حكايتنا — DIWAN",
  description: "الديوان هو مجلس ومكان اجتماع. نأخذ هذا الإحساس إلى القهوة اليومية.",
};

export default function OurStoryPage() {
  return (
    <main className="relative">
      <HeaderNav />

      {/* Hero */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 pt-24 text-center md:px-20">
        <span className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-green/50">
          Our Story
        </span>
        <h1 className="font-editorial text-5xl font-bold text-green md:text-7xl">
          حكايتنا
        </h1>
        <p className="mt-2 font-arabic text-lg text-n400">
          مجلس يبدأ بفنجان
        </p>
      </section>

      {/* Brand Story */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-20">
        <div className="mx-auto max-w-2xl space-y-12">
          {/* The Diwan */}
          <div>
            <h2 className="font-editorial text-3xl font-bold text-green md:text-4xl">
              الديوان هو مجلس ومكان اجتماع
            </h2>
            <p className="mt-6 font-arabic text-base leading-[1.9] text-n500" dir="rtl">
              نأخذ هذا الإحساس إلى القهوة اليومية: طقوس مألوفة، تفاصيل محسوبة، وتوليفات سهلة الاختيار.
              في هدوء الصباح أو حول جلسة مع الأصدقاء، هناك دائماً مساحة لفنجان.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-n400">
              A diwan is a council, a gathering place. We bring this feeling to everyday coffee:
              familiar rituals, thoughtful details, and easy choices. In the quiet of the morning
              or around a gathering with friends, there is always room for a cup.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-n200" />
            <span className="font-arabic text-sm text-n300">قهوة لكل ثقافة</span>
            <div className="h-px flex-1 bg-n200" />
          </div>

          {/* Purpose */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-aqeeq/70">
              الغرض · Purpose
            </span>
            <h3 className="mt-3 font-editorial text-2xl font-bold text-green">
              نجعل القهوة اليومية لحظة مريحة
            </h3>
            <p className="mt-4 font-arabic text-base leading-[1.9] text-n500" dir="rtl">
              تجمع الناس، وتمنح صاحبها طقساً بسيطاً يعود إليه. ونحترم كل ثقافة قهوة كما هي: لا ننتقص
              من التركي لأن فيه روبوستا، ولا نمجّد المختصة لأنها single origin. نقدم القهوة ببساطة
              تؤنس الناس، بلا تعقيد ولا معادلات.
            </p>
          </div>

          {/* Promise */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-aqeeq/70">
              الوعد · Promise
            </span>
            <h3 className="mt-3 font-editorial text-2xl font-bold text-green">
              طعم يعتمد عليه
            </h3>
            <p className="mt-4 font-arabic text-base leading-[1.9] text-n500" dir="rtl">
              طعم مناسب للذوق المصري، واختيار واضح وتجربة متسقة في المنتج والخدمة.
              تحميص متوازن، فحص عينات، وصف مفهوم، ومعالجة سريعة لأي تجربة غير مرضية.
            </p>
          </div>

          {/* Values */}
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "العناية بالتفاصيل",
                titleEn: "Attention to Detail",
                desc: "من اختيار الحبة لحد التغليف، كل خطوة محسوبة.",
              },
              {
                title: "الصدق في الوصف",
                titleEn: "Honest Description",
                desc: "ما نقوله عن المنتج هو اللي هتلاقيه بالظبط.",
              },
              {
                title: "كرم الاستقبال",
                titleEn: "Warm Hospitality",
                desc: "المضيف في التعامل والحريف في التفاصيل.",
              },
              {
                title: "البساطة",
                titleEn: "Simplicity",
                desc: "واحترام وقت العميل. اختيار واضح بدون تعقيد.",
              },
            ].map((value) => (
              <div
                key={value.titleEn}
                className="rounded-[14px] border border-n200 bg-n100 p-6"
              >
                <h4 className="font-arabic text-lg font-bold text-green">{value.title}</h4>
                <p className="mt-1 text-xs text-n300">{value.titleEn}</p>
                <p className="mt-3 font-arabic text-sm leading-relaxed text-n500" dir="rtl">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Personas */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-aqeeq/70">
              لمين ديوان · For Whom
            </span>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: "الهادئ",
                  nameEn: "The Calm",
                  desc: "يحب طقس القهوة والبساطة، ويحتاج وصفاً مفهوماً وتحضيراً غير معقد.",
                },
                {
                  name: "اليومي",
                  nameEn: "The Daily",
                  desc: "يريد قهوة ثابتة وواضحة، وسهولة الطلب والعودة للتجربة.",
                },
                {
                  name: "الهدية",
                  nameEn: "The Gift",
                  desc: "يهتم بالشكل والرسالة وجودة التقديم وتكوينات الهدايا.",
                },
                {
                  name: "المستكشف",
                  nameEn: "The Explorer",
                  desc: "يجرب المنشأ ودرجات التحميص، ويقرأ بيانات المنتج قبل الشراء.",
                },
              ].map((persona) => (
                <div
                  key={persona.nameEn}
                  className="rounded-[10px] border border-n200 p-5"
                >
                  <h4 className="font-arabic text-base font-bold text-green">
                    {persona.name}
                  </h4>
                  <p className="text-xs text-n300">{persona.nameEn}</p>
                  <p className="mt-2 font-arabic text-sm leading-relaxed text-n400" dir="rtl">
                    {persona.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 rounded-[14px] bg-green p-10 text-center">
            <h3 className="font-editorial text-2xl font-bold text-sandy md:text-3xl">
              هناك دائماً مساحة لفنجان
            </h3>
            <p className="text-sm text-sandy/60">There is always room for a cup</p>
            <Link
              href="/shop"
              className="mt-2 rounded-full bg-sandy px-8 py-3 text-sm font-semibold text-green transition hover:bg-sandy/90"
            >
              تسوّق الآن
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
