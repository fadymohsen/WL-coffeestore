import { create } from "zustand";

export type Lang = "en" | "ar";

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: "en",
  setLang: (lang) => set({ lang }),
  toggle: () => set((s) => ({ lang: s.lang === "en" ? "ar" : "en" })),
}));

export function useT() {
  const lang = useLangStore((s) => s.lang);
  return (en: string, ar: string) => (lang === "en" ? en : ar);
}

export function useDir() {
  const lang = useLangStore((s) => s.lang);
  return lang === "ar" ? "rtl" : "ltr";
}

// Structured translations for components with many strings
export const translations = {
  nav: {
    shop: { en: "Shop", ar: "المتجر" },
    ourStory: { en: "Our Story", ar: "حكايتنا" },
    home: { en: "Home", ar: "الرئيسية" },
  },
  hero: {
    tagline: {
      en: "Start your morning with a cup you know. Consistent taste, clear choice, and a story that begins with the first sip.",
      ar: "ابدأ صباحك بفنجان تعرفه. مذاق ثابت، خيار واضح، وحكاية تبدأ من أول رشفة.",
    },
    shopNow: { en: "Shop Now", ar: "تسوّق الآن" },
    coffeeForEveryCulture: { en: "Coffee for Every Culture", ar: "قهوة لكل ثقافة" },
    scroll: { en: "Scroll", ar: "مرّر للأسفل" },
  },
  grind: {
    text: {
      en: "Fresh grinding preserves the bean's flavor as it is. No complications.",
      ar: "طحن طازج يحافظ على نكهة الحبة كما هي. بدون تعقيد.",
    },
    cta: { en: "Discover the Pour", ar: "شاهد الصبّة" },
  },
  pour: {
    label: { en: "Second Ritual — The Pour", ar: "الطقس الثاني · الصبّة" },
    text: {
      en: "Hot water poured gently over coffee. Each pour reveals a different flavor. The simplicity of preparation is part of the joy.",
      ar: "ماء ساخن يُصبّ على القهوة بهدوء، وكل صبّة تُظهر طعماً مختلفاً.",
    },
    recipe: { en: "Brewing Method", ar: "طريقة التحضير" },
    hide: { en: "Hide", ar: "إخفاء" },
    step1: { en: "1. 15g medium-ground coffee, rinse the filter.", ar: "1. 15 جراماً من القهوة المطحونة متوسطاً، واغسل الفلتر." },
    step2: { en: "2. Wet the coffee with 45g water, wait 30 seconds.", ar: "2. بلّل القهوة بـ 45 جراماً من الماء وانتظر 30 ثانية." },
    step3: { en: "3. Pour in a circular motion up to 240g.", ar: "3. اسكب الماء بحركة دائرية حتى 240 جراماً." },
    step4: { en: "4. Filtration finishes in about 2 minutes and 45 seconds.", ar: "4. تنتهي التصفية خلال دقيقتين و45 ثانية تقريباً." },
  },
  sip: {
    label: { en: "Third Ritual — The Sip", ar: "الطقس الثالث · الرشفة" },
  },
  shopScene: {
    choose: { en: "Choose\nYour Cup", ar: "اختر\nفنجانك" },
    findYourCup: { en: "Find Your Cup", ar: "اختر فنجانك" },
    shop: { en: "Shop", ar: "تسوّق" },
    backToTop: { en: "Back to Top", ar: "العودة للأعلى" },
  },
  coffeeRitual: { en: "Coffee Ritual", ar: "طقس القهوة" },
  pourWord: { en: "Pour", ar: "صبّة" },
  sipWord: { en: "Sip", ar: "رشفة" },
  cart: {
    yourBag: { en: "Your Bag", ar: "سلتك" },
    closeBag: { en: "Close bag", ar: "إغلاق السلة" },
    emptyBag: { en: "Your bag is empty", ar: "السلة فارغة" },
    total: { en: "Total", ar: "الإجمالي" },
    checkout: { en: "Checkout", ar: "إتمام الطلب" },
  },
  product: {
    addToBag: { en: "Add to Bag", ar: "أضف للسلة" },
    add: { en: "Add", ar: "أضف" },
    inBag: { en: "In Bag", ar: "في السلة" },
    bag: { en: "Bag", ar: "السلة" },
  },
  footer: {
    brandDesc: {
      en: "A place to gather. We bring this feeling to everyday coffee: familiar rituals, thoughtful details, and easy choices.",
      ar: "الديوان هو مجلس ومكان اجتماع. نأخذ هذا الإحساس إلى القهوة اليومية: طقوس مألوفة، تفاصيل محسوبة، وتوليفات سهلة الاختيار.",
    },
    links: { en: "Links", ar: "الروابط" },
    contactUs: { en: "Contact Us", ar: "تواصل معنا" },
    location: { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
    tagline: { en: "Coffee for Every Culture", ar: "قهوة لكل ثقافة" },
  },
  shopPage: {
    title: { en: "Shop", ar: "المتجر" },
    subtitle: {
      en: "Choose your coffee. Every blend is carefully roasted and crafted for the Egyptian palate.",
      ar: "اختار قهوتك. كل توليفة محمّصة بعناية ومُعدّة للذوق المصري.",
    },
    noProducts: { en: "No products in this category yet.", ar: "لا توجد منتجات في هذا التصنيف حالياً." },
    giftingLabel: { en: "Gifting", ar: "الهدايا" },
    giftingTitle: { en: "Coffee worthy of every occasion", ar: "قهوة تليق بالمناسبات" },
    giftingDesc: {
      en: "Premium gift sets with beautiful packaging. Choose the blend and we will prepare it.",
      ar: "تكوينات هدايا مميزة بتغليف يليق. اختار التوليفة والتغليف وإحنا نجهزها.",
    },
    filters: {
      all: { en: "All", ar: "الكل" },
      blend: { en: "Blend", ar: "توليفة" },
      specialty: { en: "Specialty", ar: "مختصة" },
      turkish: { en: "Turkish", ar: "تركي" },
    },
  },
  ourStory: {
    label: { en: "Our Story", ar: "حكايتنا" },
    subtitle: { en: "A gathering that begins with a cup", ar: "مجلس يبدأ بفنجان" },
    diwanTitle: {
      en: "A diwan is a council, a gathering place",
      ar: "الديوان هو مجلس ومكان اجتماع",
    },
    diwanDescAr: {
      en: "We bring this feeling to everyday coffee: familiar rituals, thoughtful details, and easy choices. In the quiet of the morning or around a gathering with friends, there is always room for a cup.",
      ar: "نأخذ هذا الإحساس إلى القهوة اليومية: طقوس مألوفة، تفاصيل محسوبة، وتوليفات سهلة الاختيار. في هدوء الصباح أو حول جلسة مع الأصدقاء، هناك دائماً مساحة لفنجان.",
    },
    purposeLabel: { en: "Purpose", ar: "الغرض" },
    purposeTitle: {
      en: "We make everyday coffee a comforting moment",
      ar: "نجعل القهوة اليومية لحظة مريحة",
    },
    purposeDesc: {
      en: "It brings people together, giving them a simple ritual to return to. We respect every coffee culture as it is: we don't diminish Turkish for having Robusta, and we don't glorify specialty for being single origin. We serve coffee simply, to make people feel at home, with no complexity or formulas.",
      ar: "تجمع الناس، وتمنح صاحبها طقساً بسيطاً يعود إليه. ونحترم كل ثقافة قهوة كما هي: لا ننتقص من التركي لأن فيه روبوستا، ولا نمجّد المختصة لأنها single origin. نقدم القهوة ببساطة تؤنس الناس، بلا تعقيد ولا معادلات.",
    },
    promiseLabel: { en: "Promise", ar: "الوعد" },
    promiseTitle: { en: "A taste you can rely on", ar: "طعم يعتمد عليه" },
    promiseDesc: {
      en: "A taste suited to the Egyptian palate, clear choices, and a consistent experience in product and service. Balanced roasting, sample testing, understandable descriptions, and quick resolution of any unsatisfactory experience.",
      ar: "طعم مناسب للذوق المصري، واختيار واضح وتجربة متسقة في المنتج والخدمة. تحميص متوازن، فحص عينات، وصف مفهوم، ومعالجة سريعة لأي تجربة غير مرضية.",
    },
    values: [
      { title: { en: "Attention to Detail", ar: "العناية بالتفاصيل" }, desc: { en: "From selecting the bean to packaging, every step is measured.", ar: "من اختيار الحبة لحد التغليف، كل خطوة محسوبة." } },
      { title: { en: "Honest Description", ar: "الصدق في الوصف" }, desc: { en: "What we say about the product is exactly what you'll find.", ar: "ما نقوله عن المنتج هو اللي هتلاقيه بالظبط." } },
      { title: { en: "Warm Hospitality", ar: "كرم الاستقبال" }, desc: { en: "A gracious host in manner, precise in details.", ar: "المضيف في التعامل والحريف في التفاصيل." } },
      { title: { en: "Simplicity", ar: "البساطة" }, desc: { en: "Respecting the customer's time. A clear choice without complication.", ar: "واحترام وقت العميل. اختيار واضح بدون تعقيد." } },
    ],
    forWhomLabel: { en: "For Whom", ar: "لمين ديوان" },
    personas: [
      { name: { en: "The Calm", ar: "الهادئ" }, desc: { en: "Loves the coffee ritual and simplicity, needs understandable descriptions and uncomplicated preparation.", ar: "يحب طقس القهوة والبساطة، ويحتاج وصفاً مفهوماً وتحضيراً غير معقد." } },
      { name: { en: "The Daily", ar: "اليومي" }, desc: { en: "Wants consistent and clear coffee, easy ordering, and a reliable experience.", ar: "يريد قهوة ثابتة وواضحة، وسهولة الطلب والعودة للتجربة." } },
      { name: { en: "The Gift", ar: "الهدية" }, desc: { en: "Cares about appearance, the message, quality presentation, and gift sets.", ar: "يهتم بالشكل والرسالة وجودة التقديم وتكوينات الهدايا." } },
      { name: { en: "The Explorer", ar: "المستكشف" }, desc: { en: "Tries origins and roast levels, reads product details before buying.", ar: "يجرب المنشأ ودرجات التحميص، ويقرأ بيانات المنتج قبل الشراء." } },
    ],
    ctaTitle: { en: "There is always room for a cup", ar: "هناك دائماً مساحة لفنجان" },
    ctaButton: { en: "Shop Now", ar: "تسوّق الآن" },
  },
} as const;

// Helper to get a translated value from a { en, ar } object
export function useLocalized() {
  const lang = useLangStore((s) => s.lang);
  return <T extends { en: string; ar: string }>(obj: T) => obj[lang];
}
