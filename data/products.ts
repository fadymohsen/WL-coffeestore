export type Category = "قهوة تركي" | "إسبريسو" | "قهوة منكهة";
export type CategoryId = "turkish" | "espresso" | "flavored";
export type Roast = "فاتح" | "وسط" | "غامق";
export type Spice = "سادة" | "محوج";

export interface Bi {
  ar: string;
  en: string;
}

export const CATEGORY_META: Record<CategoryId, { ar: Category; label: Bi; blurb: Bi }> = {
  turkish: {
    ar: "قهوة تركي",
    label: { ar: "قهوة تركي", en: "Turkish Coffee" },
    blurb: { ar: "ثلاث توليفات، تحميصان لكل توليفة، سادة أو محوج.", en: "Three blends, two roasts each, plain or cardamom-spiced." },
  },
  espresso: {
    ar: "إسبريسو",
    label: { ar: "إسبريسو", en: "Espresso" },
    blurb: { ar: "ثلاث توليفات بنسب أرابيكا وروبوستا واضحة.", en: "Three blends with clear Arabica and Robusta ratios." },
  },
  flavored: {
    ar: "قهوة منكهة",
    label: { ar: "قهوة منكهة", en: "Flavored Coffee" },
    blurb: { ar: "قهوة مطحونة منكهة بقوام ناعم مع الحليب.", en: "Flavored ground coffee with a smooth texture, made with milk." },
  },
};

export const ROAST_EN: Record<Roast, string> = { فاتح: "Light", وسط: "Medium", غامق: "Dark" };
export const SPICE_EN: Record<Spice, string> = { سادة: "Plain", محوج: "Spiced" };
const ROAST_KEY: Record<Roast, string> = { فاتح: "light", وسط: "medium", غامق: "dark" };
const SPICE_KEY: Record<Spice, string> = { سادة: "plain", محوج: "spiced" };

export const variantKey = (roast?: Roast, spice?: Spice) =>
  roast && spice ? `${ROAST_KEY[roast]}-${SPICE_KEY[spice]}` : "default";

export interface Variant {
  key: string;
  label: Bi;
  /** EGP per 200 g pack, from the DIWAN price list */
  price: number;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: Category;
  categoryId: CategoryId;
  /** Card colour */
  hex: string;
  /** Art / text colour used on the card's coloured block */
  art: string;
  copy: string;
  copyEn: string;
  weight: string;
  weightEn: string;
  roasts?: [Roast, Roast];
  states?: [Spice, Spice];
  ratio?: { arabica: number; robusta: number; label: string; labelEn: string };
  type?: string;
  typeEn?: string;
  steps: string[];
  stepsEn: string[];
  note?: string;
  noteEn?: string;
  illustration: string;
  /** Lifestyle photo for the pack */
  image: string;
  variants: Variant[];
}

const TURKISH_STEPS = [
  "8 جم قهوة",
  "80 مل ماء",
  "أضف السكر على ذوقك",
  "قلّب ثم سخّن على نار هادئة",
  "ارفع قبل الغليان واسكب بهدوء",
];
const TURKISH_STEPS_EN = [
  "8 g coffee",
  "80 ml water",
  "Add sugar to taste",
  "Stir, then heat on a low flame",
  "Lift before it boils and pour gently",
];
const ESPRESSO_STEPS = [
  "18 جم بن",
  "وزّع بالتساوي واضغط بإحكام",
  "36 جم مشروب / 25–30 ثانية",
  "فنجانك جاهز استمتع بالرشفة",
];
const ESPRESSO_STEPS_EN = [
  "18 g coffee",
  "Distribute evenly and tamp firmly",
  "36 g in the cup / 25–30 seconds",
  "Your cup is ready. Enjoy the sip",
];
const FLAVORED_STEPS = [
  "10 جم قهوة منكهة",
  "80 مل حليب + 40 مل ماء",
  "أضف السكر على ذوقك",
  "سخّن على نار هادئة مع التقليب برفق",
  "ارفع قبل الغليان واسكب بهدوء",
];
const FLAVORED_STEPS_EN = [
  "10 g flavored coffee",
  "80 ml milk + 40 ml water",
  "Add sugar to taste",
  "Heat on a low flame, stirring gently",
  "Lift before it boils and pour gently",
];
const ESPRESSO_NOTE = "نقطة بداية لضبط الطحنة";
const ESPRESSO_NOTE_EN = "A starting point for dialling in the grind";

const IMG = "/assets/diwan/products";
const one = (price: number): Variant[] => [{ key: "default", label: { ar: "200 جم", en: "200 g" }, price }];
const turkish = (prices: Record<string, number>, roasts: [Roast, Roast]): Variant[] =>
  roasts.flatMap((r) =>
    (["سادة", "محوج"] as Spice[]).map((s) => ({
      key: variantKey(r, s),
      label: { ar: `${r} · ${s}`, en: `${ROAST_EN[r]} · ${SPICE_EN[s]}` },
      price: prices[variantKey(r, s)],
    })),
  );

export const PRODUCTS: Product[] = [
  {
    id: "ons", name: "أُنس", nameEn: "Ons", category: "قهوة تركي", categoryId: "turkish", hex: "#4E5B33", art: "#CDA76C",
    copy: "أُنس: توليفة يومية مألوفة، واضحة وسهلة الاختيار. متاحة سادة أو محوج.",
    copyEn: "Ons: a familiar daily blend, clear and easy to choose. Available plain or spiced.",
    weight: "200 جم", weightEn: "200 g", roasts: ["وسط", "غامق"], states: ["سادة", "محوج"],
    steps: TURKISH_STEPS, stepsEn: TURKISH_STEPS_EN, illustration: "clink", image: `${IMG}/ons.webp`,
    variants: turkish({ "medium-plain": 240, "dark-plain": 260, "medium-spiced": 270, "dark-spiced": 290 }, ["وسط", "غامق"]),
  },
  {
    id: "murad", name: "مراد", nameEn: "Murad", category: "قهوة تركي", categoryId: "turkish", hex: "#A8432C", art: "#F4ECDC",
    copy: "قهوة تركي بثبات واضح وحضور غني يناسب فنجانك اليومي.",
    copyEn: "Turkish coffee with a steady character and rich presence, made for your daily cup.",
    weight: "200 جم", weightEn: "200 g", roasts: ["وسط", "غامق"], states: ["سادة", "محوج"],
    steps: TURKISH_STEPS, stepsEn: TURKISH_STEPS_EN, illustration: "cezve", image: `${IMG}/murad.webp`,
    variants: turkish({ "medium-plain": 280, "dark-plain": 300, "medium-spiced": 310, "dark-spiced": 330 }, ["وسط", "غامق"]),
  },
  {
    id: "mazaj", name: "مزاج", nameEn: "Mazaj", category: "قهوة تركي", categoryId: "turkish", hex: "#A18A6F", art: "#F4ECDC",
    copy: "قهوة تركي هادئة ومتوازنة، متاحة بدرجة فاتح أو وسط، سادة أو محوج.",
    copyEn: "A calm, balanced Turkish coffee, available in light or medium roast, plain or spiced.",
    weight: "200 جم", weightEn: "200 g", roasts: ["فاتح", "وسط"], states: ["سادة", "محوج"],
    steps: TURKISH_STEPS, stepsEn: TURKISH_STEPS_EN, illustration: "bistro", image: `${IMG}/mazaj.webp`,
    variants: turkish({ "light-plain": 220, "medium-plain": 220, "light-spiced": 250, "medium-spiced": 250 }, ["فاتح", "وسط"]),
  },
  {
    id: "zad", name: "زاد", nameEn: "Zad", category: "إسبريسو", categoryId: "espresso", hex: "#0E3A33", art: "#F4ECDC",
    copy: "بداية لها حضور؛ إسبريسو قوي يحتفظ بشخصيته مع الحليب.",
    copyEn: "A start with presence: a strong espresso that keeps its character with milk.",
    weight: "200 جم", weightEn: "200 g", ratio: { arabica: 60, robusta: 40, label: "60% أرابيكا · 40% روبوستا", labelEn: "60% Arabica · 40% Robusta" },
    steps: ESPRESSO_STEPS, stepsEn: ESPRESSO_STEPS_EN, note: ESPRESSO_NOTE, noteEn: ESPRESSO_NOTE_EN, illustration: "portafilter",
    image: `${IMG}/zad.webp`, variants: one(280),
  },
  {
    id: "tayf", name: "طيف", nameEn: "Tayf", category: "إسبريسو", categoryId: "espresso", hex: "#1D5557", art: "#F4ECDC",
    copy: "رشفة إسبريسو، أو لمسة حليب؛ طيف يرافق لحظتك بتوازن.",
    copyEn: "A sip of espresso or a touch of milk: Tayf keeps your moment company, in balance.",
    weight: "200 جم", weightEn: "200 g", ratio: { arabica: 80, robusta: 20, label: "80% أرابيكا · 20% روبوستا", labelEn: "80% Arabica · 20% Robusta" },
    steps: ESPRESSO_STEPS, stepsEn: ESPRESSO_STEPS_EN, note: ESPRESSO_NOTE, noteEn: ESPRESSO_NOTE_EN, illustration: "steam",
    image: `${IMG}/tayf.webp`, variants: one(300),
  },
  {
    id: "layl", name: "ليل", nameEn: "Layl", category: "إسبريسو", categoryId: "espresso", hex: "#292827", art: "#F4ECDC",
    copy: "على مهل تروى التفاصيل؛ ليل تحكيه رشفة إسبريسو أو أمريكانو.",
    copyEn: "Details are told slowly: Layl is a sip of espresso or americano.",
    weight: "200 جم", weightEn: "200 g", ratio: { arabica: 100, robusta: 0, label: "100% أرابيكا", labelEn: "100% Arabica" },
    steps: ESPRESSO_STEPS, stepsEn: ESPRESSO_STEPS_EN, note: ESPRESSO_NOTE, noteEn: ESPRESSO_NOTE_EN, illustration: "lantern",
    image: `${IMG}/layl.webp`, variants: one(340),
  },
  {
    id: "fransawy", name: "فرنساوي", nameEn: "Fransawy", category: "قهوة منكهة", categoryId: "flavored", hex: "#F4ECDC", art: "#563326",
    copy: "فرنساوي · على ذوقك. قهوة مطحونة منكهة بقوام ناعم مع الحليب.",
    copyEn: "Fransawy, your way. Flavored ground coffee with a smooth texture, made with milk.",
    weight: "200 جم", weightEn: "200 g", type: "قهوة مطحونة منكهة", typeEn: "Flavored ground coffee",
    steps: FLAVORED_STEPS, stepsEn: FLAVORED_STEPS_EN, illustration: "milk", image: `${IMG}/fransawy.webp`, variants: one(220),
  },
  {
    id: "bondok", name: "بندق", nameEn: "Bondok", category: "قهوة منكهة", categoryId: "flavored", hex: "#B68346", art: "#F4ECDC",
    copy: "قهوة مطحونة منكهة بطعم البندق المتوازن مع الحليب.",
    copyEn: "Flavored ground coffee with a balanced hazelnut taste, made with milk.",
    weight: "200 جم", weightEn: "200 g", type: "قهوة مطحونة منكهة", typeEn: "Flavored ground coffee",
    steps: FLAVORED_STEPS, stepsEn: FLAVORED_STEPS_EN, illustration: "hazelnut", image: `${IMG}/bondok.webp`, variants: one(250),
  },
  {
    id: "chocolate", name: "شوكولاتة", nameEn: "Chocolate", category: "قهوة منكهة", categoryId: "flavored", hex: "#563326", art: "#F4ECDC",
    copy: "قهوة مطحونة منكهة بلمسة الشوكولاتة الغنية.",
    copyEn: "Flavored ground coffee with a touch of rich chocolate.",
    weight: "200 جم", weightEn: "200 g", type: "قهوة مطحونة منكهة", typeEn: "Flavored ground coffee",
    steps: FLAVORED_STEPS, stepsEn: FLAVORED_STEPS_EN, illustration: "cacao", image: `${IMG}/chocolate.webp`, variants: one(250),
  },
];

export const CATEGORIES: Category[] = ["قهوة تركي", "إسبريسو", "قهوة منكهة"];
export const CATEGORY_IDS: CategoryId[] = ["turkish", "espresso", "flavored"];

export const priceFrom = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const categoryFrom = (id: CategoryId) =>
  Math.min(...PRODUCTS.filter((p) => p.categoryId === id).map(priceFrom));

export const PERSONAS: { id: string; name: Bi; desc: Bi; picks: string[] }[] = [
  {
    id: "calm", name: { ar: "الهادئ", en: "The Calm Ritualist" },
    desc: { ar: "يحب طقس القهوة والبساطة، ويحتاج وصفاً واضحاً وتحضيراً سهلاً.", en: "Loves the coffee ritual and simplicity, and needs a clear description and easy preparation." },
    picks: ["mazaj", "fransawy"],
  },
  {
    id: "daily", name: { ar: "اليومي", en: "The Daily Drinker" },
    desc: { ar: "يريد قهوة ثابتة وواضحة، وطلباً سهلاً، وتجربة تتكرر.", en: "Wants consistent, clear coffee, easy ordering, and an experience worth repeating." },
    picks: ["ons", "zad"],
  },
  {
    id: "gift", name: { ar: "الهدية", en: "The Gift Buyer" },
    desc: { ar: "يهتم بالتقديم وحكاية الفتح وتفاصيل التغليف.", en: "Cares about presentation, the unboxing story and packaging details." },
    picks: ["layl", "bondok"],
  },
  {
    id: "explorer", name: { ar: "المستكشف", en: "The Explorer" },
    desc: { ar: "يجرب منشأ ودرجات تحميص مختلفة، ويقرأ المواصفات قبل الشراء.", en: "Tries different origins and roast levels, and reads the specs before buying." },
    picks: ["layl", "tayf"],
  },
];

export const DEFERRED: Bi[] = [
  { ar: "القهوة المختصة", en: "Specialty Coffee" },
  { ar: "القهوة العربي", en: "Arabic Coffee" },
  { ar: "الاشتراكات", en: "Subscriptions" },
  { ar: "الهدايا / بوكسات هدايا", en: "Gifts / Gift Boxes" },
  { ar: "المشروبات السريعة", en: "Instant Drinks" },
];

export const PILLARS: { name: Bi; pct: number }[] = [
  { name: { ar: "طقس القهوة", en: "Coffee rituals" }, pct: 15 },
  { name: { ar: "المنتج والاختيار", en: "Product and choice" }, pct: 25 },
  { name: { ar: "الضيافة والمجتمع", en: "Hospitality and community" }, pct: 10 },
  { name: { ar: "من داخل ديوان — قصص وقرارات", en: "Inside DIWAN: stories and decisions" }, pct: 50 },
];

export const REELS: { title: Bi; desc: Bi }[] = [
  { title: { ar: "افتح الحكاية", en: "Open the Story" }, desc: { ar: "فتح البوكس والكارت والختم الشمعي", en: "Opening the box, the card and the wax seal" } },
  { title: { ar: "حضّرها على ذوقك", en: "Brew It Your Way" }, desc: { ar: "خطوات الوصفة من ظهر الكارت", en: "The recipe steps from the back of the card" } },
  { title: { ar: "داخل ديوان", en: "Inside DIWAN" }, desc: { ar: "التحميص والتعبئة والتجربة بصوت المؤسس ويديه", en: "Roasting, packing and testing, in the founder's voice and hands" } },
];

export const BRAND_STORY: Bi = {
  ar: "الديوان هو مجلس ومكان اجتماع. نأخذ هذا الإحساس إلى القهوة اليومية: طقوس مألوفة، تفاصيل محسوبة، وتوليفات سهلة الاختيار. في هدوء الصباح أو حول جلسة مع الأصدقاء، هناك دائماً مساحة لفنجان.",
  en: "A diwan is a council and a place to gather. We bring that feeling to everyday coffee: familiar rituals, measured details and blends that are easy to choose. In the quiet of the morning or around a gathering with friends, there is always room for a cup.",
};

export const SLOGAN: Bi = { ar: "الحكاية تبدأ بفنجان", en: "The story begins with a cup" };
export const CLOSING_LINE: Bi = {
  ar: "قهوة تحترم حكايتها، وتجربة تستحق أن تتكرر.",
  en: "Coffee that respects its story, and an experience worth repeating.",
};
