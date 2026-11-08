export type Category = "قهوة تركي" | "إسبريسو" | "قهوة منكهة";
export type Roast = "فاتح" | "وسط" | "غامق";
export type Spice = "سادة" | "محوج";

export interface Product {
  id: string;
  name: string;
  category: Category;
  hex: string;
  /** Art / text colour used on the card's coloured block */
  art: string;
  copy: string;
  weight: string;
  roasts?: [Roast, Roast];
  states?: [Spice, Spice];
  ratio?: { arabica: number; robusta: number; label: string };
  type?: string;
  steps: string[];
  note?: string;
  illustration: string;
  price?: number; // pulled from store config only — never hardcoded discounts
}

const TURKISH_STEPS = [
  "8 جم قهوة",
  "80 مل ماء",
  "أضف السكر على ذوقك",
  "قلّب ثم سخّن على نار هادئة",
  "ارفع قبل الغليان واسكب بهدوء",
];
const ESPRESSO_STEPS = [
  "18 جم بن",
  "وزّع بالتساوي واضغط بإحكام",
  "36 جم مشروب / 25–30 ثانية",
  "فنجانك جاهز استمتع بالرشفة",
];
const FLAVORED_STEPS = [
  "10 جم قهوة منكهة",
  "80 مل حليب + 40 مل ماء",
  "أضف السكر على ذوقك",
  "سخّن على نار هادئة مع التقليب برفق",
  "ارفع قبل الغليان واسكب بهدوء",
];
const ESPRESSO_NOTE = "نقطة بداية لضبط الطحنة";

export const PRODUCTS: Product[] = [
  {
    id: "ons", name: "أُنس", category: "قهوة تركي", hex: "#4E5B33", art: "#CDA76C",
    copy: "أُنس: توليفة يومية مألوفة، واضحة وسهلة الاختيار. متاحة سادة أو محوج.",
    weight: "200 جم", roasts: ["وسط", "غامق"], states: ["سادة", "محوج"],
    steps: TURKISH_STEPS, illustration: "clink",
  },
  {
    id: "murad", name: "مراد", category: "قهوة تركي", hex: "#A8432C", art: "#F4ECDC",
    copy: "قهوة تركي بثبات واضح وحضور غني يناسب فنجانك اليومي.",
    weight: "200 جم", roasts: ["وسط", "غامق"], states: ["سادة", "محوج"],
    steps: TURKISH_STEPS, illustration: "cezve",
  },
  {
    id: "mazaj", name: "مزاج", category: "قهوة تركي", hex: "#A18A6F", art: "#F4ECDC",
    copy: "قهوة تركي هادئة ومتوازنة، متاحة بدرجة فاتح أو وسط، سادة أو محوج.",
    weight: "200 جم", roasts: ["فاتح", "وسط"], states: ["سادة", "محوج"],
    steps: TURKISH_STEPS, illustration: "bistro",
  },
  {
    id: "zad", name: "زاد", category: "إسبريسو", hex: "#0E3A33", art: "#F4ECDC",
    copy: "بداية لها حضور؛ إسبريسو قوي يحتفظ بشخصيته مع الحليب.",
    weight: "200 جم", ratio: { arabica: 60, robusta: 40, label: "60% أرابيكا · 40% روبوستا" },
    steps: ESPRESSO_STEPS, note: ESPRESSO_NOTE, illustration: "portafilter",
  },
  {
    id: "tayf", name: "طيف", category: "إسبريسو", hex: "#1D5557", art: "#F4ECDC",
    copy: "رشفة إسبريسو، أو لمسة حليب؛ طيف يرافق لحظتك بتوازن.",
    weight: "200 جم", ratio: { arabica: 80, robusta: 20, label: "80% أرابيكا · 20% روبوستا" },
    steps: ESPRESSO_STEPS, note: ESPRESSO_NOTE, illustration: "steam",
  },
  {
    id: "layl", name: "ليل", category: "إسبريسو", hex: "#292827", art: "#F4ECDC",
    copy: "على مهل تروى التفاصيل؛ ليل تحكيه رشفة إسبريسو أو أمريكانو.",
    weight: "200 جم", ratio: { arabica: 100, robusta: 0, label: "100% أرابيكا" },
    steps: ESPRESSO_STEPS, note: ESPRESSO_NOTE, illustration: "lantern",
  },
  {
    id: "fransawy", name: "فرنساوي", category: "قهوة منكهة", hex: "#F4ECDC", art: "#563326",
    copy: "فرنساوي · على ذوقك. قهوة مطحونة منكهة بقوام ناعم مع الحليب.",
    weight: "200 جم", type: "قهوة مطحونة منكهة",
    steps: FLAVORED_STEPS, illustration: "milk",
  },
  {
    id: "bondok", name: "بندق", category: "قهوة منكهة", hex: "#B68346", art: "#F4ECDC",
    copy: "قهوة مطحونة منكهة بطعم البندق المتوازن مع الحليب.",
    weight: "200 جم", type: "قهوة مطحونة منكهة",
    steps: FLAVORED_STEPS, illustration: "hazelnut",
  },
  {
    id: "chocolate", name: "شوكولاتة", category: "قهوة منكهة", hex: "#563326", art: "#F4ECDC",
    copy: "قهوة مطحونة منكهة بلمسة الشوكولاتة الغنية.",
    weight: "200 جم", type: "قهوة مطحونة منكهة",
    steps: FLAVORED_STEPS, illustration: "cacao",
  },
];

export const CATEGORIES: Category[] = ["قهوة تركي", "إسبريسو", "قهوة منكهة"];

/** Store config — price & stock come from here (real data), never invented. */
export const STORE: Record<string, { price: number | null; stock: number | null }> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, { price: null, stock: null }]),
);

export const PERSONAS = [
  { id: "calm", name: "الهادئ", desc: "يحب طقس القهوة والبساطة، ويحتاج وصفاً واضحاً وتحضيراً سهلاً.", picks: ["mazaj", "fransawy"] },
  { id: "daily", name: "اليومي", desc: "يريد قهوة ثابتة وواضحة، وطلباً سهلاً، وتجربة تتكرر.", picks: ["ons", "zad"] },
  { id: "gift", name: "الهدية", desc: "يهتم بالتقديم وحكاية الفتح وتفاصيل التغليف.", picks: ["layl", "bondok"] },
  { id: "explorer", name: "المستكشف", desc: "يجرب منشأ ودرجات تحميص مختلفة، ويقرأ المواصفات قبل الشراء.", picks: ["layl", "tayf"] },
] as const;

export const DEFERRED = [
  "القهوة المختصة",
  "القهوة العربي",
  "الاشتراكات",
  "الهدايا / بوكسات هدايا",
  "المشروبات السريعة",
];

export const PILLARS = [
  { name: "طقس القهوة", pct: 15 },
  { name: "المنتج والاختيار", pct: 25 },
  { name: "الضيافة والمجتمع", pct: 10 },
  { name: "من داخل ديوان — قصص وقرارات", pct: 50 },
];

export const REELS = [
  { title: "افتح الحكاية", desc: "فتح البوكس والكارت والختم الشمعي" },
  { title: "حضّرها على ذوقك", desc: "خطوات الوصفة من ظهر الكارت" },
  { title: "داخل ديوان", desc: "التحميص والتعبئة والتجربة بصوت المؤسس ويديه" },
];

export const BRAND_STORY =
  "الديوان هو مجلس ومكان اجتماع. نأخذ هذا الإحساس إلى القهوة اليومية: طقوس مألوفة، تفاصيل محسوبة، وتوليفات سهلة الاختيار. في هدوء الصباح أو حول جلسة مع الأصدقاء، هناك دائماً مساحة لفنجان.";

export const SLOGAN = "الحكاية تبدأ بفنجان";
export const CLOSING_LINE = "قهوة تحترم حكايتها، وتجربة تستحق أن تتكرر.";
