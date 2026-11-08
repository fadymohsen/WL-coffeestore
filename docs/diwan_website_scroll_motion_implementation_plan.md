# DIWAN (ديوان) — Complete A-to-Z Website & Scroll-Motion Implementation Plan (Claude Blueprint)

> **System Role & Objective for Claude:**  
> You are building a production-ready, scroll-motion trending e-commerce & brand storytelling website for **DIWAN Roastery (ديوان)** (`@diwan_eg`), an Egyptian coffee brand rooted in contemporary Egyptian-Islamic hospitality ("مجلس معاصر بطابع مصري إسلامي"). Every design token, SVG geometry rule, typographic scale, product variant, recipe step, and packaging layer below is extracted directly from the official **DIWAN Brand System (Updated Nov 4, 2026)**, **DIWAN Logo Application Manual**, and **DIWAN 9-Card Print System (18 Sides)**. Follow every constraint strictly without inventing unapproved colors, slogans, or product SKUs.

---

## 1. Brand DNA, Strategy & Voice Rules (A-to-Z)

### 1.1 Core Identity & Philosophy
* **Brand Name:** ديوان (`DIWAN` / `DIWAN ROASTERY · CAIRO`)
* **Social Handle:** `@diwan_eg` (Instagram, Facebook, TikTok)
* **Primary & Only Approved Slogan:** `الحكاية تبدأ بفنجان` (Never add a Latin slogan underneath the logo; never use the retired candidate slogan `لكل حكاية فنجان` in production).
* **Core Essence (الجوهر):** مجلس يبدأ بفنجان (*A gathering place that starts with a cup*).
* **Brand Purpose (الغرض):** Making daily coffee a comfortable moment that brings people together and gives its owner a simple ritual to return to. DIWAN respects every coffee culture as it is—never looking down on Turkish coffee because it contains Robusta, and never over-glorifying Specialty coffee just because it is single origin (`نحترم كل ثقافة قهوة كما هي`).
* **Brand Promise (الوعد):** Taste tailored to the Egyptian palate (`طعم مناسب للذوق المصري`), clear choice (`وضوح الاختيار`), and a consistent experience across product and service.
* **Core Values (القيم):** Attention to detail (`العناية بالتفاصيل`), honesty in description (`الصدق في الوصف`), warm hospitality (`كرم الاستقبال`), simplicity and respect for the customer's time (`البساطة واحترام وقت العميل`).
* **Brand Personality (شخصية البراند):** Friendly, calm, confident, contemporary classic with an Egyptian-Islamic cultural character (`كلاسيك معاصر بطابع مصري إسلامي — طابع ثقافي لا توجّه ديني`), tactile natural materials (`خامات محسوسة`), and comfortable spaces (`مساحات مريحة`). Acts as **"The Host in interaction, and The Craftsman in details"** (`المضيف في التعامل والحرفي في التفاصيل`).
* **What DIWAN Is NOT (ما ليس عليه):** Never pretentious, loud, visually cluttered, or reliant on unverified claims (`ليس متكلفاً أو صاخباً أو مزدحماً بصرياً، ولا يعتمد على ادعاءات غير موثقة`).

### 1.2 Target Customer Personas (شخصيات الشراء)
1. **The Calm Ritualist (الهادئ):** Loves the coffee ritual and simplicity; needs an easy-to-understand description and uncomplicated preparation.
2. **The Daily Drinker (اليومي):** Wants consistent, clear coffee, easy ordering, and a reliable repeat experience.
3. **The Gift Buyer (الهدية):** Cares about presentation, the unboxing story, gift quality, and packaging details.
4. **The Explorer (المستكشف):** Tries different origins and roast levels, and reads product specs before buying.

### 1.3 Mandatory Copywriting & Tone of Voice Constraints
* **Tone:** Warm, clear, confident, unpretentious (`بسيطة وواضحة وغير متكلفة، واثقة من غير ادعاء`). Explain technical terms only when they help the customer choose.
* **Strict Forbidden Copy:** Never use exaggeration, health promises, or superlative claims like `"أفضل قهوة على الإطلاق"` (*"The best coffee ever"*).
* **Strict Word & Line Length Limits:**
  * **Marketing Headline / Hook (الجملة التسويقية):** `≤ 12 words` (`12 كلمة كحد أقصى`).
  * **Product Tagline / Subtitle (سطر المنتج):** `≤ 2 lines` (`سطرين كحد أقصى`).
  * **Category Description (وصف الفئة):** `≤ 40 words` (`40 كلمة كحد أقصى`).
* **Mandatory Verbatim Brand Story (قصة البراند — صفحة «حكايتنا»):**
  > «الديوان هو مجلس ومكان اجتماع. نأخذ هذا الإحساس إلى القهوة اليومية: طقوس مألوفة، تفاصيل محسوبة، وتوليفات سهلة الاختيار. في هدوء الصباح أو حول جلسة مع الأصدقاء، هناك دائماً مساحة لفنجان.»
  * *Rule:* Must be quoted verbatim on the `"حكايتنا"` (Our Story) section/page of the website without paraphrasing.
* **Messaging Hierarchy Triggers (هرمية الرسائل):**
  * **Primary Slogan:** `الحكاية تبدأ بفنجان`
  * **Unboxing Trigger (دعوة الفتح):** `افتح الحكاية` (Used on the box security seal and the interactive unboxing scroll trigger).
  * **Brewing Trigger (دعوة التحضير):** `حضّرها على ذوقك` (Used as the header for all interactive recipe cards).
* **Approved Copy Examples for UI & Microcopy:**
  * *Daily Ritual Banner:* `ابدأ صباحك بفنجان تعرفه. مذاق ثابت، خيار واضح، وحكاية تبدأ من أول رشفة.`
  * *Blend Intro Example:* `أُنس: توليفة يومية مألوفة، واضحة وسهلة الاختيار. متاحة سادة أو محوج.`
  * *Consultation CTA / Help Widget:* `لو تحب نرشح لك توليفة حسب طريقة التحضير والذوق، ابعت لنا وسنساعدك مباشرة.`
  * *Guarantee / Support Copy:* `نراجع التجربة معك بسرعة، ونعالج سبب المشكلة، ونقترح بديلاً مناسباً.`

---

## 2. Complete Visual Identity, Color Tokens & Logo System

### 2.1 Logo System & Geometric Construction (`DIWAN Logo Manual`)
The DIWAN logo lockup (قفل الشعار) consists of three inseparable vector elements:
1. **The Arch (القوس):** An Islamic pointed arch (`قوس خطّي بأرجل ممتدة`).
   * **Primary Mark (الأساسي · Outline):** Linear arch where `Arch Stroke Width = Wordmark Stroke Width = 0.140 × Font Size`. Used on website headers, hero sections, packaging bags, cards, and all large/close-up digital surfaces (`≥ 22mm` / `≥ 64px` width).
   * **Alternate Mark (البديل · Solid):** Solid filled silhouette arch with identical outer dimensions. Used **only** for favicons, small app/profile icons, stamps, and sizes `< 22mm` (`< 64px` down to `10mm` minimum).
2. **The Wordmark (الاسم — ديوان):** Custom vector geometry based on `Reem Kufi` (`ريم كوفي`). **Never** type "ديوان" as live text using a standard font; always use the locked vector path.
3. **The Vocalization Marks (التشكيل — الكسرة والفتحة):** The diagonal *Fatha* above the Waw/Ya and *Kasra* below the Dal are **always colored in Carnelian (`#A8432C`)** across both light and dark backgrounds.

#### Geometric Proportions & Clear Space Rules:
* **Arch-to-Wordmark Width Ratio:** `Arch Width = 0.80 × Wordmark Width` (`عرض القوس = عرض الاسم × 0.80`).
* **Vertical Gap (Arch to Wordmark):** Approximately `1×` the letter stroke width (`لا تُزاد`).
* **Clear Space (المسافة الآمنة):** Minimum `4×` the letter stroke width on all sides (`أربعة أضعاف سُمك الحرف من كل اتجاه`).
* **Tagline Lockup Rule:** When `الحكاية تبدأ بفنجان` appears under the logo, it is set in **Amiri**, width never exceeding the wordmark width, separated by a thin **Carnelian (`#A8432C`)** horizontal line in formal lockups, and omitted completely at sizes `< 30mm` (`< 90px`).
* **Strict Logo Misuse Prohibitions (ممنوعات):**
  1. Never thin the arch stroke relative to the wordmark (`ترفيع القوس عن سُمك الحرف`).
  2. Never rotate or tilt the logo (`تدوير الشعار`).
  3. Never stretch or compress the logo (`تمديد أو ضغط الشعار` — always scale proportionally).
  4. Never render the main wordmark or arch in Carnelian on a Deep Green background (`عقيق على أخضر` — fails contrast at `2.10:1`; only the small Tashkeel accents remain Carnelian).
  5. Never apply drop shadows or gradients to the logo (`تدرّج أو ظل`).
  6. Never use off-palette colors (`ألوان خارج البالتة`) or tint percentages (`الدرجات`) on the logo—the logo must always be 100% solid palette colors.

### 2.2 Master Color System & CSS Variables (Palette, Tints, UI & Product Colors)
In any general brand layout, maintain the **Golden Color Ratio**: **60% Sand (`#F4ECDC`) · 28% Deep Green (`#0E3A33`) · 8% Carnelian (`#A8432C`) · 4% Ink (`#16211E`)**.

```css
:root {
  /* ==========================================================================
     1. CORE BRAND PALETTE (البالتة الأساسية) - 60 : 28 : 8 : 4 Ratio
     ========================================================================== */
  --diwan-sand: #F4ECDC;         /* 60% Primary Background | RGB(244, 236, 220) */
  --diwan-green: #0E3A33;        /* 28% Primary Brand / Headers / CTAs | RGB(14, 58, 51) */
  --diwan-carnelian: #A8432C;    /* 8% Accent / Tashkeel / Highlights | RGB(168, 67, 44) */
  --diwan-ink: #16211E;          /* 4% Body Copy & Detailed Specs | RGB(22, 33, 30) */
  --diwan-sand-deep: #E4D9C3;    /* Secondary Surface / Arch Pattern Stroke | RGB(228, 217, 195) */
  --diwan-gold-illus: #CDA76C;   /* Illustration Line Art Accent (Non-metallic flat print/SVG tone) */

  /* ==========================================================================
     2. APPROVED TINTS SCALE (الدرجات - For Backgrounds, Dividers & Tables ONLY)
     ========================================================================== */
  /* Diwan Deep Green Tints */
  --diwan-green-100: #0E3A33;
  --diwan-green-75:  #4A6B66;
  --diwan-green-50:  #869C99;
  --diwan-green-25:  #C3CECC;
  --diwan-green-10:  #E7EBEB;

  /* Carnelian Tints */
  --diwan-carnelian-100: #A8432C;
  --diwan-carnelian-75:  #BE7261;
  --diwan-carnelian-50:  #D4A196;
  --diwan-carnelian-25:  #E9D0CA;
  --diwan-carnelian-10:  #F6ECEA;

  /* Sand Tints */
  --diwan-sand-100: #F4ECDC;
  --diwan-sand-75:  #F7F1E5;
  --diwan-sand-50:  #FAF6EE;
  --diwan-sand-25:  #FCFAF6;
  --diwan-sand-10:  #FEFDFC;

  /* Ink Tints */
  --diwan-ink-100: #16211E;
  --diwan-ink-75:  #505856;
  --diwan-ink-50:  #8A908E;
  --diwan-ink-25:  #C5C8C7;
  --diwan-ink-10:  #E8E9E8;

  /* ==========================================================================
     3. E-COMMERCE UI NEUTRAL & FUNCTIONAL TOKENS (ألوان الواجهة والنظام)
     ========================================================================== */
  --ui-n100: #F7F4ED;            /* Soft borders & input field backgrounds */
  --ui-n200: #E4DFD3;            /* Dividers & card borders */
  --ui-n300: #BDB5A6;            /* Disabled text & secondary icons */
  --ui-n400: #8A8172;            /* Muted / secondary text */
  --ui-n500: #4A463F;            /* Alternate primary text */

  --ui-success: #2E6B4F;         /* Order confirmation & success states */
  --ui-error:   #A8322F;         /* Input validation & payment error states */
  --ui-warning: #9A6B12;         /* Low stock or shipping delay alerts */
  --ui-info:    #2A5B77;         /* Neutral informational badges */

  /* ==========================================================================
     4. 9 PRODUCT CARD SIGNATURE THEMES (التمييز اللوني للمنتجات التسعة)
     ========================================================================== */
  /* Category 1: Turkish Coffee (قهوة تركي) */
  --card-ons:       #4E5B33;     /* أُنس (Ons) - Olive Moss Green */
  --card-murad:     #A8432C;     /* مراد (Murad) - Rich Carnelian Terracotta */
  --card-mazaj:     #A18A6F;     /* مزاج (Mazaj) - Warm Taupe Roast */

  /* Category 2: Espresso Blends (إسبريسو) */
  --card-zad:       #0E3A33;     /* زاد (Zad) - Diwan Deep Green */
  --card-tayf:      #1D5557;     /* طيف (Tayf) - Deep Teal Petrol */
  --card-layl:      #292827;     /* ليل (Layl) - Charcoal Night Black */

  /* Category 3: Flavored Coffee (قهوة منكهة) */
  --card-fransawy:  #F4ECDC;     /* فرنساوي (Fransawy) - Creamy Sand (with #563326 brown art/text) */
  --card-bondok:    #B68346;     /* بندق (Bondok) - Roasted Hazelnut Gold */
  --card-chocolate: #563326;     /* شوكولاتة (Chocolate) - Dark Cocoa Brown */
}
```

#### WCAG Contrast & Pairing Rules (التركيبات اللونية المعتمدة والمرفوضة):
* **Approved High-Contrast Pairings (Minimum 4.5:1 required):**
  * `Ink (#16211E)` on `Sand (#F4ECDC)` → **14.07:1** (Primary reading text)
  * `Deep Green (#0E3A33)` on `Sand (#F4ECDC)` → **10.69:1** (Headings & primary UI)
  * `Sand (#F4ECDC)` on `Deep Green (#0E3A33)` → **10.69:1** (Hero & dark sections)
  * `Deep Green (#0E3A33)` on `Sand Deep (#E4D9C3)` → **8.98:1** (Secondary cards)
  * `Carnelian (#A8432C)` on `Sand (#F4ECDC)` → **5.10:1** (Accents & badges)
  * `Sand (#F4ECDC)` on `Carnelian (#A8432C)` → **5.10:1** (Alert/Highlight banners; use Sand text on Carnelian, never Ink on Carnelian)
* **Strictly Forbidden Pairings (مرفوضة):**
  * `Carnelian (#A8432C)` text/logo on `Deep Green (#0E3A33)` (**2.10:1** — only allowed for small decorative Tashkeel or thin illustration strokes, never for readable text).
  * `Ink (#16211E)` on `Deep Green (#0E3A33)` (**1.32:1**).
  * `Sand Deep (#E4D9C3)` text on `Sand (#F4ECDC)` (**1.19:1** — only allowed for subtle background tissue-paper arch watermarks, never for text).

---

## 3. Typography, Iconography, Pattern & Layout Grid

### 3.1 Google Fonts Stack (SIL Open Font License)
Load from Google Fonts with `display=swap`:
1. **`Reem Kufi` (ريم كوفي):** Strictly reserved for the vector logo wordmark (`اسم الشعار فقط — لا يُستخدم في النصوص`). Do not use for website headings or body text.
2. **`Amiri` (أميري — Regular 400 & Bold 700):** Editorial headings, section titles, storytelling quotes, and the slogan `الحكاية تبدأ بفنجان`.
3. **`IBM Plex Sans Arabic` (آي بي إم بليكس عربي — Light 300, Regular 400, Medium 500, SemiBold 600, Bold 700):** All UI controls, body copy, product descriptions, variant selectors, recipe steps, and nutrition/spec labels.
4. **`Cormorant Garamond` (كورمورانت — Regular 400, SemiBold 600, Italic):** Secondary Latin text, English subtitles (`DIWAN ROASTERY · CAIRO`, `COFFEE FOR EVERY CULTURE`), and tabular numerals where appropriate.
5. **Numerals & Ratios Rule (الأرقام والمقادير):** Always render numbers in standard Western Arabic digits (`0 1 2 3 4 5 6 7 8 9` — e.g., `200 جم`, `80 مل`, `60% أرابيكا`) with bidirectional isolation (`unicode-bidi: isolate` / `<bdi>`) so quantities and percentages never flip inside RTL Arabic sentences.

### 3.2 Responsive Grid & 4px Spacing System (`Page 33`)
All spacing, padding, and margins **must** be multiples of `4px` (`4, 8, 16, 24, 32, 48, 64px`). Never use arbitrary pixel values outside this scale.
* **Desktop (`≥ 1280px`):** 12 Columns · `gutter: 24px` · `margin: 80px` · `max-width: 1440px`
* **Tablet (`768px – 1279px`):** 8 Columns · `gutter: 20px` · `margin: 40px`
* **Mobile (`≤ 767px`):** 4 Columns · `gutter: 16px` · `margin: 20px`
* **Reading Measure (عرض سطر النص):** `60–75 characters` (`60ch–75ch`).
* **Spacing Tokens:**
  * Inside components (`داخل المكون`): `4px` · `8px`
  * Between components (`بين المكونات`): `16px` · `24px`
  * Between page sections (`بين الأقسام`): `48px` · `64px` (scale up to `96px–128px` for scroll-motion pinned containers)
  * Border Radius (`نصف قطر الزوايا`): `6px` (inputs/tags) · `10px` (buttons/selectors) · `14px` (cards/modals)

### 3.3 Custom Icon Set Specifications (`Page 32`)
12 official custom icons: `تحميص` (Roast), `طحن` (Grind), `منشأ` (Origin), `توصيل` (Delivery), `هدية` (Gift), `تحضير` (Brewing), `وزن` (Weight), `درجة التحميص` (Roast Level), `تخزين` (Storage), `مختصة` (Specialty), `مجلس` (Majlis/Hospitality), `ضمان` (Guarantee).
* **Construction:** `24×24px` grid, `20×20px` live optical area (`2px` padding), `stroke-width: 1.4px`, `stroke-linecap: round`, `stroke-linejoin: round`, `fill: none`.
* **Approved Sizes:** `16px · 20px · 24px · 32px · 42px` (Never render smaller than `16px`).
* **Usage Rule:** Use a single palette color matching the category context. Never use icons as background patterns or mix them in the same visual container as the Arch Pattern.

### 3.4 The Arch Pattern (`نظام الباترن — Pages 31 & 52`)
* **Tissue Paper Pattern (باترن ورق الزبدة):** Uses **only** the standalone Diwan Arch path (`القوس المستقل`) in `Sand Deep (#E4D9C3)` over `Sand (#F4ECDC)`.
* **Geometric Repeat:** Arch unit width `18mm` (`~54px`), horizontal repeat `32mm` (`~96px`), vertical repeat `28mm` (`~84px`) with a `16mm` (`~48px`) half-drop row offset (`إزاحة صفوف`).
* **Box Geometric Arabesque (زخارف البوكس):** The 8-pointed star/cross Islamic geometric border (`#CDA76C` gold line art on `#0E3A33` Deep Green) is strictly reserved for the outer shipping box Concept section and must **not** replace the subtle Arch Pattern on general reading backgrounds.

---

## 4. Complete Product Catalog, Variant Matrix & Recipe Data (`JSON` Ready)

### 4.1 Product Catalog Rules (`Pages 34–46, 62–75, 79–80`)
* **Standard Weight:** All 9 launch products come in a **200g (`200 جم`)** matte white stand-up zipper pouch (`الكيس الأبيض`).
* **Bag vs. Card Architecture:** Every pouch carries the **exact same transparent sticker** (`استيكر الكيس الشفاف` — Deep Green logo, Carnelian Tashkeel, and `الحكاية تبدأ بفنجان`). Product differentiation happens through the **9 double-sided 9×12cm Product Cards** (`الكروت التسعة — 18 وجهاً`) included inside the box.
* **Turkish Coffee Matrix (`12 Variants across 3 Blends`):**
  * Turkish coffee blends **never** display Arabica/Robusta percentages on their cards or product pages (`نسب الحبوب لا تطبع على كروت التركي`).
  * Each Turkish blend offers **2 valid roast levels × 2 spice states (`سادة` Plain / `محوج` Cardamom-Spiced) = 4 variants per blend (12 total Turkish SKUs)**.
  * **CRITICAL UI RULE (`Pages 37, 75, 80`):** On the website Product Detail Page (PDP) and digital card previews, **only display or enable the 2 valid roast levels for that specific blend** (`لا تترك خانة لدرجة غير متاحة` — never allow a user to select "فاتح" for Ons/Murad, or "غامق" for Mazaj!):
    * **أُنس (Ons):** `وسط` (Medium) OR `غامق` (Dark) × `سادة` (Plain) OR `محوج` (Spiced) → *4 Variants*
    * **مراد (Murad):** `وسط` (Medium) OR `غامق` (Dark) × `سادة` (Plain) OR `محوج` (Spiced) → *4 Variants*
    * **مزاج (Mazaj):** `فاتح` (Light) OR `وسط` (Medium) × `سادة` (Plain) OR `محوج` (Spiced) → *4 Variants*

### 4.2 Master 9-Product Dataset (`src/data/products.ts`)

| # | ID | Arabic Name | Category (`الفئة`) | Card Hex | Blend / Roast Specs | Official Card Copy (`الكتابة القصصية`) | Brewing Recipe (`حضّرها على ذوقك — ظهر الكارت`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `ons` | **أُنس** | `قهوة تركي` | `#4E5B33` (Olive) + `#CDA76C` art | **Roasts:** `وسط` / `غامق`<br>**States:** `سادة` / `محوج`<br>**Weight:** `200 جم` | `أُنس: توليفة يومية مألوفة، واضحة وسهلة الاختيار. متاحة سادة أو محوج.` *(Illustration: Two hands clinking two coffee cups with rising steam)* | **1.** `8 جم قهوة`<br>**2.** `80 مل ماء`<br>**3.** `أضف السكر على ذوقك`<br>**4.** `قلّب ثم سخّن على نار هادئة`<br>**5.** `ارفع قبل الغليان واسكب بهدوء` |
| **2** | `murad` | **مراد** | `قهوة تركي` | `#A8432C` (Carnelian) + `#F4ECDC` art | **Roasts:** `وسط` / `غامق`<br>**States:** `سادة` / `محوج`<br>**Weight:** `200 جم` | `قهوة تركي بثبات واضح وحضور غني يناسب فنجانك اليومي.` *(Illustration: Hand pouring Turkish kanaka/cezve into cup)* | **1.** `8 جم قهوة`<br>**2.** `80 مل ماء`<br>**3.** `أضف السكر على ذوقك`<br>**4.** `قلّب ثم سخّن على نار هادئة`<br>**5.** `ارفع قبل الغليان واسكب بهدوء` |
| **3** | `mazaj` | **مزاج** | `قهوة تركي` | `#A18A6F` (Taupe) + `#F4ECDC` art | **Roasts:** `فاتح` / `وسط`<br>**States:** `سادة` / `محوج`<br>**Weight:** `200 جم` | `قهوة تركي هادئة ومتوازنة، متاحة بدرجة فاتح أو وسط، سادة أو محوج.` *(Illustration: Cup steaming on a café bistro table with chair)* | **1.** `8 جم قهوة`<br>**2.** `80 مل ماء`<br>**3.** `أضف السكر على ذوقك`<br>**4.** `قلّب ثم سخّن على نار هادئة`<br>**5.** `ارفع قبل الغليان واسكب بهدوء` |
| **4** | `zad` | **زاد** | `إسبريسو` | `#0E3A33` (Deep Green) | **Ratio:** `60% أرابيكا · 40% روبوستا`<br>**Weight:** `200 جم` | `بداية لها حضور؛ إسبريسو قوي يحتفظ بشخصيته مع الحليب.` *(Illustration: Portafilter extracting double shot into cup)* | **1.** `18 جم بن`<br>**2.** `وزّع بالتساوي واضغط بإحكام`<br>**3.** `36 جم مشروب / 25–30 ثانية`<br>**4.** `فنجانك جاهز استمتع بالرشفة`<br>*(Note: نقطة بداية لضبط الطحنة)* |
| **5** | `tayf` | **طيف** | `إسبريسو` | `#1D5557` (Deep Teal) | **Ratio:** `80% أرابيكا · 20% روبوستا`<br>**Weight:** `200 جم` | `رشفة إسبريسو، أو لمسة حليب؛ طيف يرافق لحظتك بتوازن.` *(Illustration: Espresso cup with dual Sand & Carnelian steam ribbons)* | **1.** `18 جم بن`<br>**2.** `وزّع بالتساوي واضغط بإحكام`<br>**3.** `36 جم مشروب / 25–30 ثانية`<br>**4.** `فنجانك جاهز استمتع بالرشفة`<br>*(Note: نقطة بداية لضبط الطحنة)* |
| **6** | `layl` | **ليل** | `إسبريسو` | `#292827` (Charcoal Black) | **Ratio:** `100% أرابيكا`<br>**Weight:** `200 جم` | `على مهل تروى التفاصيل؛ ليل تحكيه رشفة إسبريسو أو أمريكانو.` *(Illustration: Traditional Islamic lantern glowing beside espresso cup)* | **1.** `18 جم بن`<br>**2.** `وزّع بالتساوي واضغط بإحكام`<br>**3.** `36 جم مشروب / 25–30 ثانية`<br>**4.** `فنجانك جاهز استمتع بالرشفة`<br>*(Note: نقطة بداية لضبط الطحنة)* |
| **7** | `fransawy` | **فرنساوي** | `قهوة منكهة` | `#F4ECDC` (Sand) + `#563326` art | **Type:** `قهوة مطحونة منكهة`<br>**Weight:** `200 جم` | `فرنساوي · على ذوقك. قهوة مطحونة منكهة بقوام ناعم مع الحليب.` *(Illustration: Pitcher pouring warm milk into coffee cup)* | **1.** `10 جم قهوة منكهة`<br>**2.** `80 مل حليب + 40 مل ماء`<br>**3.** `أضف السكر على ذوقك`<br>**4.** `سخّن على نار هادئة مع التقليب برفق`<br>**5.** `ارفع قبل الغليان واسكب بهدوء` |
| **8** | `bondok` | **بندق** | `قهوة منكهة` | `#B68346` (Hazelnut Gold) | **Type:** `قهوة مطحونة منكهة`<br>**Weight:** `200 جم` | `قهوة مطحونة منكهة بطعم البندق المتوازن مع الحليب.` *(Illustration: Coffee cup with two whole hazelnuts and leaves)* | **1.** `10 جم قهوة منكهة`<br>**2.** `80 مل حليب + 40 مل ماء`<br>**3.** `أضف السكر على ذوقك`<br>**4.** `سخّن على نار هادئة مع التقليب برفق`<br>**5.** `ارفع قبل الغليان واسكب بهدوء` |
| **9** | `chocolate` | **شوكولاتة** | `قهوة منكهة` | `#563326` (Cocoa Brown) | **Type:** `قهوة مطحونة منكهة`<br>**Weight:** `200 جم` | `قهوة مطحونة منكهة بلمسة الشوكولاتة الغنية.` *(Illustration: Cacao pod and leaves over a coffee cup)* | **1.** `10 جم قهوة منكهة`<br>**2.** `80 مل حليب + 40 مل ماء`<br>**3.** `أضف السكر على ذوقك`<br>**4.** `سخّن على نار هادئة مع التقليب برفق`<br>**5.** `ارفع قبل الغليان واسكب بهدوء` |

### 4.3 Deferred / Upcoming Categories (`الفئات المؤجلة — Pages 35, 41–46, 79`)
The Brand System explicitly mandates that **5 categories are reserved for future updates (`لم يتم تحديثها بعد / محجوز للتحديث`)**:
1. **القهوة المختصة** (Specialty Coffee)
2. **القهوة العربي** (Arabic Coffee)
3. **الاشتراكات** (Subscriptions)
4. **الهدايا / بوكسات هدايا** (Gift Boxes — *Note: The current box is approved as the standard coffee packaging; dedicated multi-item Gift Box tiers are deferred*)
5. **المشروبات السريعة** (Instant Drinks — e.g., Hot Chocolate, Nescafé/Instant Coffee)

* **STRICT WEBSITE RULE (`Page 79`):** Never display fake products, assumed origins, or placeholder prices for these 5 deferred categories (`الأقسام المؤجلة لا تعرض كمنتجات متاحة أو باقات مدفوعة قبل استكمال تفاصيلها`). Display them in a clean **"قريباً في ديوان" (Coming Soon to DIWAN)** roadmap grid with a `"بلّغني عند الإطلاق"` (Notify Me) interest drawer.

---

## 5. Scroll-Motion Website Architecture & Section-by-Section Choreography

### 5.1 Recommended Tech Stack for Claude Sonnet
* **Framework:** Next.js 14/15 (App Router, TypeScript) or React + Vite (`dir="rtl" lang="ar"`).
* **Styling:** Tailwind CSS v3.4+ configured with custom DIWAN CSS variables and RTL logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`).
* **Scroll & Motion Engine:**
  * **Lenis (`@studio-freight/lenis`):** Buttery-smooth inertial scrolling tuned to DIWAN's calm personality (`lerp: 0.08`, `smoothWheel: true`).
  * **GSAP (`gsap` + `ScrollTrigger`):** Pinned storytelling sequences, 5-stage unboxing choreography, and SVG path drawing (`stroke-dashoffset`).
  * **Framer Motion:** 3D 180° card flips (Front `الوش` ↔ Back `الظهر`), category tab transitions, and interactive Turkish variant selectors.

### 5.2 Complete 8-Section Scroll-Motion Storyboard (Mapping the 6-Step Customer Journey, `Page 14`)

#### **Section 1: Pinned Hero & Portal — «الاكتشاف: مجلس يبدأ بفنجان»**
* **Visual Concept:** Opens on a warm `Sand (#F4ECDC)` canvas with the **DIWAN Primary Outline Arch (`#0E3A33`)** centered above the `ديوان` wordmark (with `#A8432C` Carnelian Tashkeel) and `الحكاية تبدأ بفنجان` in Amiri.
* **Scroll Motion Choreography (`0% → 100% Hero Pin`):**
  1. As the user scrolls, the **Arch SVG scales up smoothly** (`scale(1) → scale(18)`), acting as an architectural window mask into a warm Cairo morning scene overlooking Islamic Cairo & the Pyramids with a brass kanaka, V60, and espresso cup on a wooden table (`Pages 4–6`).
  2. Floating headline reveals (`≤ 12 words`): **`قهوة تحترم حكايتها، وتجربة تستحق أن تتكرر.`**
  3. Subtitle (`Cormorant Garamond` + `IBM Plex Sans Arabic`): `COFFEE FOR EVERY CULTURE · نحترم كل ثقافة قهوة كما هي`
  4. Dual CTA: Primary Deep Green button `استكشف التوليفات التسع` (smooth-scrolls to Catalog) + Secondary ghost button `افتح الحكاية` (scrolls to the Interactive Unboxing section).

#### **Section 2: Interactive 5-Stage Scrollytelling Unboxing — «افتح الحكاية: تجربة التقديم والأنبوكسنج» (`Pages 47–60`)**
This is the centerpiece scroll-motion showcase translating DIWAN's physical packaging specification into an interactive pinned sequence (`height: 400vh`, pinned `100vh` viewport):
* **Stage 1 (`0%–20% Scroll`): The Outer Box & Security Seal (`الكونسبت الخارجي وقفل البوكس`)**
  * Shows the closed `19 × 15 × 3.75 cm` foldable carton box (`علبة كرتون مطوي بغطاء مفصلي`). Left side shows the warm Cairo café street illustration; right side shows the Deep Green (`#0E3A33`) panel with geometric gold (`#CDA76C`) arabesque borders and the **`4 × 6 cm` Security Seal Sticker (`استيكر قفل البوكس`)** reading **`افتح الحكاية`** wrapped across the front edge (`3.75 cm` front + `2.25 cm` underside).
  * *Scroll Action:* Scrolling peels/breaks the `افتح الحكاية` seal with a subtle paper-tear micro-animation.
* **Stage 2 (`20%–45% Scroll`): Opening the Lid & The Bean-to-Cup Story (`الحكاية داخل الغطاء — Page 55`)**
  * The hinged box lid rotates open (`rotateX(0deg -> 110deg)`), revealing the inside lid (`#0E3A33` background).
  * **SVG Stroke-Draw Animation:** As the lid opens, the continuous line-art illustration draws itself from right to left in `Sand (#F4ECDC)` and `Carnelian (#A8432C)`:
    1. **Top Row (The Origin & Craft):** Hand planting seed (`بذرة`) → Coffee tree & farmer harvesting cherries (`زراعة وقطف`) → Sun-drying beds (`تجفيف`) → Drum roaster (`تحميص`) → Grinder (`طحن`).
    2. **Middle Branching Stream (One Carnelian Line Splits into 3 Brewing Cultures):** A single `#A8432C` line flows out of the grinder and branches into three stations: **V60 Pour-Over** (right), **Espresso Portafilter** (center), and **Turkish Kanaka/Cezve** (left).
    3. **Bottom Row (The Gathering / المجلس):** Three friends sitting together enjoying their cups—including a young man on the left, **a woman wearing a hijab in the center (`المرأة في الرسمة بحجاب` — mandatory detail per Pages 18 & 55)**, and a man with glasses on the right.
* **Stage 3 (`45%–65% Scroll`): The Carnelian Wax Seal & Arch Tissue Paper (`الختم الشمعي وورق الزبدة — Pages 52–53`)**
  * Looking down into the open box, the user sees the folded `30 × 40 cm` `Sand (#F4ECDC)` tissue paper printed with the repeating `18mm` `Sand Deep (#E4D9C3)` arches, held together at the center by the **3D embossed Carnelian Wax Seal (`الختم الشمعي العقيقي`)** bearing the DIWAN logo.
  * *Scroll Action:* The wax seal lifts and the left/right tissue paper folds open (`rotateY`) with a soft paper-rustle visual cue.
* **Stage 4 (`65%–85% Scroll`): The Product Card Reveal (`الكارت فوق الورق المختوم — Page 64`)**
  * Resting inside is the `9 × 12 cm` double-sided product card (e.g., `أُنس` in `#4E5B33` Olive Green), which floats upward and flips `180°` to preview the `حضّرها على ذوقك` visual recipe on the back.
* **Stage 5 (`85%–100% Scroll`): The Matte White Pouch (`الكيس الأبيض — Pages 49–50`)**
  * Beneath the card rises the `19 × 14 cm` matte white stand-up zipper pouch (`كيس أبيض بملمس هادئ، سوستة إغلاق، من دون فالف`) with the `8 × 12 cm` transparent sticker (`49mm` logo lockup in `#0E3A33` + `#A8432C` Tashkeel).

#### **Section 3: The 9-Card Interactive Showroom & 3D Card Flipper — «الاختيار: الكروت التسعة» (`Pages 27, 36–39, 63–75`)**
* **Category Filter Bar:** Three active tabs (`الكل (9)` · `قهوة تركي (3)` · `إسبريسو (3)` · `قهوة منكهة (3)`).
* **Interactive 9×12 Ratio Card Grid:** Each of the 9 blends is presented as an authentic `3:4` (`9×12 cm`) interactive card matching the exact print layout from `Diwan_9_Cards_18_Sides_CMYK_Print.pdf`:
  * **Front Side (`الوش`):** Colored upper block (`75%` height) with `15mm` top-left DIWAN logo, Arabic blend title in `Amiri`, category subtitle in `IBM Plex Sans Arabic`, custom botanical/brewing line-art SVG on the right, and a `Sand (#F4ECDC)` bottom strip (`25%` height) showing `200 جم` and either the Turkish checkboxes (`فاتح / وسط / غامق` + `سادة / محوج`) or the Espresso Arabica/Robusta ratio & 2-line story.
  * **Interactive Flip (`اقلب الكارت للوصفة`):** Clicking "طريقة التحضير" or hovering/tapping flips the card `180°` in 3D (`transform-style: preserve-3d`) to reveal **Back Side (`الظهر`)**:
    * Vertical color-coded spine strip on the left edge matching the card's front color.
    * Header: `حضّرها على ذوقك` + `[الفئة] · [الاسم]`.
    * Numbered step-by-step visual diagram (`1 → 2 → 3 → 4 → 5` for Turkish/Flavored; `1 → 2 → 3 → 4` for Espresso) connected by Carnelian (`#A8432C`) arrows.
    * Interactive **"ملاحظاتك:" (Your Tasting Notes)** input line at the bottom where users can type their personal sugar/grind preference on the website (saved to `localStorage`!).
    * Footer: `الحكاية تبدأ بفنجان` · `@diwan_eg`.

#### **Section 4: Dynamic Turkish Coffee Configurator & PDP Drawer — «صفحة المنتج والاختيار» (`Pages 37, 75, 80`)**
* When a user clicks any product to configure or order:
  * **If Category = `قهوة تركي` (`أُنس`, `مراد`, `مزاج`):**
    * Renders the **2-Axis Selector (`اختيار واحد من كل محور`)**:
      * **Axis 1: `اختر التحميص` (Roast Level):** Dynamically renders **only** `[وسط] [غامق]` for `أُنس` and `مراد`, and **only** `[فاتح] [وسط]` for `مزاج`. (Never render an unavailable roast button).
      * **Axis 2: `اختر الحالة` (Spice State):** Renders `[سادة]` and `[محوج]`.
    * Selecting options dynamically checks the corresponding boxes `[✓]` on the live 9×12 card preview beside the selector!
  * **If Category = `إسبريسو` (`زاد`, `طيف`, `ليل`):**
    * Displays the Arabica/Robusta ratio bar (`60/40`, `80/20`, `100%`) and a grind/usage selector (`حبوب كاملة` / `مطحون إسبريسو`) alongside the `18g → 36g in 25–30s` calibration badge (`نقطة بداية لضبط الطحنة`).
  * **If Category = `قهوة منكهة` (`فرنساوي`, `بندق`, `شوكولاتة`):**
    * Displays `قهوة مطحونة منكهة · 200 جم` with the milk-to-water ratio callout (`80 مل حليب + 40 مل ماء`).
  * **Pricing & Stock Rule (`Pages 35, 80, 87`):** Pull price and stock dynamically from a clean store configuration object (`السعر والمخزون يسحبان من بيانات المتجر الفعلية`) without hardcoding fake discounts.

#### **Section 5: Interactive Brewing Ritual Guide — «التحضير: حضّرها على ذوقك» (`Page 74`)**
* A dedicated scroll-triggered interactive brewing timer & ratio calculator for the 3 core preparation methods:
  1. **التركي (Turkish):** `8 جم بن + 80 مل ماء` — 5 animated steps with a gentle flame visual.
  2. **الإسبريسو (Espresso):** `18 جم بن ← 36 جم مشروب (1:2 Ratio) في 25–30 ثانية` — includes an interactive 30-second extraction shot timer.
  3. **المنكهة (Flavored):** `10 جم قهوة + 80 مل حليب + 40 مل ماء` — shows the two-cup liquid ratio (`2/3 Milk : 1/3 Water`).

#### **Section 6: Brand Story, Persona Matcher & Audio Ambience — «حكايتنا والروح» (`Pages 5–9, 17`)**
* **Verbatim Story Block:** Displays the exact approved `"حكايتنا"` paragraph set in `Amiri` over a `Sand (#F4ECDC)` surface with subtle `Sand Deep (#E4D9C3)` Arch Pattern watermark.
* **"أي شخصية قهوة أنت؟" (4-Persona Interactive Matcher, `Page 8`):** Four interactive cards (`الهادئ`, `اليومي`, `الهدية`, `المستكشف`) that immediately filter/highlight the ideal DIWAN blend for that visitor:
  * *الهادئ* → `مزاج` or `فرنساوي`
  * *اليومي* → `أُنس` or `زاد`
  * *الهدية* → Full Unboxing Set + `ليل` / `بندق`
  * *المستكشف* → `ليل (100% أرابيكا)` & `طيف (80% أرابيكا)`
* **Optional Ambient Sound Toggle (`الصوت والأجواء — Page 17`):**
  * Following Page 17 (`صوت التحضير ومساحة من الهدوء`), include a subtle, **muted-by-default** audio ambience toggle (`أجواء ديوان الصوتية`): plays authentic, calm coffee preparation sounds (grinding, pouring coffee into a ceramic cup) normalized to `≤ -14 LUFS`, with zero commercial background music (`بدون موسيقى مضافة فوق صوت التحضير`).

#### **Section 7: Behind DIWAN (Founder-Led Journal & Community) — «من داخل ديوان» (`Pages 15–16, 77–78`)**
* **4 Content Pillars Showcase (`ركائز المحتوى`):**
  1. `طقس القهوة` (Coffee Rituals — 15%)
  2. `المنتج والاختيار` (Product & Choice Education — 25%)
  3. `الضيافة والمجتمع` (Hospitality & Community — 10%)
  4. `من داخل ديوان — قصص وقرارات` (Behind the Scenes & Founder Decisions — 50%)
* **3 Reel/Story Format Cards (`الستوري والريلز — Page 78`):**
  * Card 1: **`افتح الحكاية`** (Unboxing the box, card, and wax seal)
  * Card 2: **`حضّرها على ذوقك`** (Recipe steps from the back of the card)
  * Card 3: **`داخل ديوان`** (Roasting, packaging, and testing with the founder's voice/hands)

#### **Section 8: Roadmap of Upcoming Categories & Footer — «قريباً في ديوان» (`Pages 41–46, 79, 82, 89`)**
* **Deferred Categories Roadmap Grid (`محجوز للتحديث القادم`):** Clean, honest cards with a `"قريباً — لم يتم تحديثها بعد"` badge (`#E4D9C3` pill) for:
  1. `القهوة المختصة` (Specialty Coffee)
  2. `القهوة العربي` (Arabic Coffee)
  3. `الاشتراكات` (Subscriptions)
  4. `الهدايا / بوكسات هدايا` (Gift Boxes)
  5. `المشروبات السريعة` (Instant Drinks)
* **Future Physical Roastery Vision (`البيئة البصرية المستقبلية — Page 82`):** A subtle editorial glimpse of the future DIWAN café & roastery space (Deep Green awning, warm wood, calm natural materials), explicitly captioned as a future vision (`اتجاه بيئي مستقبلي`).
* **Closing Sign-off Footer (`Page 89`):**
  * Deep Green (`#0E3A33`) full-width footer.
  * Centered `Sand (#F4ECDC)` Outline Logo + `Carnelian (#A8432C)` Tashkeel + `الحكاية تبدأ بفنجان`.
  * Closing Brand Line: **`قهوة تحترم حكايتها، وتجربة تستحق أن تتكرر.`**
  * Social Link: `@diwan_eg` (Instagram · Facebook · TikTok).

---

## 6. Asset Extraction & SVG Pipeline (How to Feed Assets to Claude)

To ensure 100% visual fidelity to your uploaded PDFs, run a quick asset extraction step or place the extracted SVGs/PNGs into `public/assets/diwan/` before running Claude:

1. **Vector Logos (`public/assets/logo/`):**
   * `diwan-logo-primary-on-light.svg` (Deep Green `#0E3A33` arch & wordmark + Carnelian `#A8432C` Tashkeel)
   * `diwan-logo-primary-on-dark.svg` (Sand `#F4ECDC` arch & wordmark + Carnelian `#A8432C` Tashkeel)
   * `diwan-logo-solid-favicon.svg` (Alternate solid silhouette mark `< 22mm` for browser favicon & mobile app icon)
   * `diwan-arch-pattern-tile.svg` (`32mm × 28mm` repeating arch tile in `#E4D9C3` on `#F4ECDC`)
2. **Product Cards (`public/assets/cards/`):**
   * Extract the 18 high-resolution pages from `Diwan_9_Cards_18_Sides_CMYK_Print.pdf` (Pages 1–18, converted to `sRGB` WebP/SVG per `Page 26` color management rule: `ويستخدم sRGB للتسليم الرقمي`):
     * `01-ons-front.webp`, `02-ons-back.webp`
     * `03-murad-front.webp`, `04-murad-back.webp`
     * `05-mazaj-front.webp`, `06-mazaj-back.webp`
     * `07-zad-front.webp`, `08-zad-back.webp`
     * `09-tayf-front.webp`, `10-tayf-back.webp`
     * `11-layl-front.webp`, `12-layl-back.webp`
     * `13-fransawy-front.webp`, `14-fransawy-back.webp`
     * `15-bondok-front.webp`, `16-bondok-back.webp`
     * `17-chocolate-front.webp`, `18-chocolate-back.webp`
3. **Packaging & Unboxing Layers (`public/assets/unboxing/`):**
   * `box-exterior-scene.webp` (Cairo café street scene + Deep Green arabesque right panel, `Page 54`)
   * `box-interior-lid-story.svg` (Bean-to-Cup line art with hijabi woman in center gathering, `Page 55`)
   * `box-seal-sticker.svg` (`4×6 cm` Deep Green sticker with `افتح الحكاية`, `Page 51`)
   * `wax-seal-carnelian.webp` (Embossed `#A8432C` wax seal, `Page 53`)
   * `white-pouch-200g.webp` (Matte white stand-up zipper pouch with transparent sticker, `Page 49`)

---

## 7. Ready-to-Paste Master Prompt for Claude

Copy and paste the block below directly into Claude along with your extracted card/logo assets:

```markdown
You are an elite Frontend Architect and Creative Technologist. Build the complete, production-ready, scroll-motion trending RTL Arabic website for **DIWAN (ديوان)** (`@diwan_eg`), an Egyptian coffee brand ("مجلس معاصر بطابع مصري إسلامي").

### 1. STRICT BRAND & DESIGN CONSTRAINTS (DO NOT VIOLATE)
- **Direction & Language:** Full Arabic RTL (`dir="rtl" lang="ar"`). Isolate all numerals (`0-9`, `200 جم`, `80 مل`, `60%`) using `<bdi>` or `unicode-bidi: isolate`.
- **Primary Slogan:** `الحكاية تبدأ بفنجان` (Never add an English slogan under the logo; never use `لكل حكاية فنجان`).
- **Color Palette & 60-28-8-4 Ratio:**
  - `--diwan-sand: #F4ECDC` (60% Primary Background)
  - `--diwan-green: #0E3A33` (28% Primary Brand, Headers, Primary Buttons, Dark Sections)
  - `--diwan-carnelian: #A8432C` (8% Accents, Logo Tashkeel marks, Highlights — NEVER put Carnelian text on Deep Green background; use Sand `#F4ECDC` text on Carnelian backgrounds)
  - `--diwan-ink: #16211E` (4% Body Copy & Detailed Specs)
  - `--diwan-sand-deep: #E4D9C3` (Secondary surfaces & repeating Arch Pattern stroke)
  - `--diwan-gold-illus: #CDA76C` (Flat non-metallic gold illustration accents)
  - **UI Neutrals:** `N-100: #F7F4ED`, `N-200: #E4DFD3`, `N-300: #BDB5A6`, `N-400: #8A8172`, `N-500: #4A463F`
  - **UI States:** `Success: #2E6B4F`, `Error: #A8322F`, `Warning: #9A6B12`, `Info: #2A5B77`
- **Typography (Google Fonts):**
  - `Amiri` (400, 700) for all headings, quotes, and the slogan `الحكاية تبدأ بفنجان`.
  - `IBM Plex Sans Arabic` (300, 400, 500, 600, 700) for all body copy, UI controls, product cards, and recipes.
  - `Cormorant Garamond` (400, 600) for secondary English labels (`DIWAN ROASTERY · CAIRO`).
  - `Reem Kufi` is strictly for the SVG logo wordmark only—never use it for page headings or text.
- **Grid & 4px Spacing Scale:**
  - All spacing must be multiples of 4px (`4, 8, 16, 24, 32, 48, 64px`).
  - Desktop (`>=1280px`): 12 cols, `24px` gutter, `80px` margin, `1440px` max-width.
  - Tablet (`768-1279px`): 8 cols, `20px` gutter, `40px` margin.
  - Mobile (`<=767px`): 4 cols, `16px` gutter, `20px` margin.
  - Border radius: `6px` (tags/inputs), `10px` (buttons), `14px` (cards).
- **Copywriting Limits:**
  - Marketing headlines <= 12 words. Product taglines <= 2 lines. Category descriptions <= 40 words.
  - Verbatim Brand Story for "حكايتنا": «الديوان هو مجلس ومكان اجتماع. نأخذ هذا الإحساس إلى القهوة اليومية: طقوس مألوفة، تفاصيل محسوبة، وتوليفات سهلة الاختيار. في هدوء الصباح أو حول جلسة مع الأصدقاء، هناك دائماً مساحة لفنجان.»

### 2. COMPLETE 9-PRODUCT CATALOG & VARIANT LOGIC
All 9 products are `200 جم` (`200g`). Every pouch is matte white with the identical transparent DIWAN sticker; each product has its own double-sided 9×12cm card:
1. **أُنس (Ons)** | Category: `قهوة تركي` | Card Hex: `#4E5B33` | Valid Roasts: `وسط`, `غامق` (NO `فاتح`) | States: `سادة`, `محوج` (4 variants) | Copy: `توليفة يومية مألوفة، واضحة وسهلة الاختيار. متاحة سادة أو محوج.` | Recipe: `1. 8 جم قهوة -> 2. 80 مل ماء -> 3. أضف السكر على ذوقك -> 4. قلّب ثم سخّن على نار هادئة -> 5. ارفع قبل الغليان واسكب بهدوء`
2. **مراد (Murad)** | Category: `قهوة تركي` | Card Hex: `#A8432C` | Valid Roasts: `وسط`, `غامق` (NO `فاتح`) | States: `سادة`, `محوج` (4 variants) | Recipe: Same 5-step Turkish recipe.
3. **مزاج (Mazaj)** | Category: `قهوة تركي` | Card Hex: `#A18A6F` | Valid Roasts: `فاتح`, `وسط` (NO `غامق`) | States: `سادة`, `محوج` (4 variants) | Recipe: Same 5-step Turkish recipe.
4. **زاد (Zad)** | Category: `إسبريسو` | Card Hex: `#0E3A33` | Blend: `60% أرابيكا · 40% روبوستا` | Copy: `بداية لها حضور؛ إسبريسو قوي يحتفظ بشخصيته مع الحليب.` | Recipe: `1. 18 جم بن -> 2. وزّع بالتساوي واضغط بإحكام -> 3. 36 جم مشروب / 25–30 ثانية -> 4. فنجانك جاهز استمتع بالرشفة (نقطة بداية لضبط الطحنة)`
5. **طيف (Tayf)** | Category: `إسبريسو` | Card Hex: `#1D5557` | Blend: `80% أرابيكا · 20% روبوستا` | Copy: `رشفة إسبريسو، أو لمسة حليب؛ طيف يرافق لحظتك بتوازن.` | Recipe: Same 4-step Espresso recipe.
6. **ليل (Layl)** | Category: `إسبريسو` | Card Hex: `#292827` | Blend: `100% أرابيكا` | Copy: `على مهل تروى التفاصيل؛ ليل تحكيه رشفة إسبريسو أو أمريكانو.` | Recipe: Same 4-step Espresso recipe.
7. **فرنساوي (Fransawy)** | Category: `قهوة منكهة` | Card Hex: `#F4ECDC` (with `#563326` brown ink) | Copy: `قهوة مطحونة منكهة · 200 جم` | Recipe: `1. 10 جم قهوة منكهة -> 2. 80 مل حليب + 40 مل ماء -> 3. أضف السكر على ذوقك -> 4. سخّن على نار هادئة مع التقليب برفق -> 5. ارفع قبل الغليان واسكب بهدوء`
8. **بندق (Bondok)** | Category: `قهوة منكهة` | Card Hex: `#B68346` | Copy: `قهوة مطحونة منكهة · 200 جم` | Recipe: Same 5-step Flavored recipe.
9. **شوكولاتة (Chocolate)** | Category: `قهوة منكهة` | Card Hex: `#563326` | Copy: `قهوة مطحونة منكهة · 200 جم` | Recipe: Same 5-step Flavored recipe.

**Deferred Categories Rule:** Display `القهوة المختصة`, `القهوة العربي`, `الاشتراكات`, `الهدايا / بوكسات هدايا`, and `المشروبات السريعة` in a dedicated "قريباً في ديوان (محجوز للتحديث)" section without fake products or prices.

### 3. REQUIRED SCROLL-MOTION SECTIONS & INTERACTIVE FEATURES
1. **Smooth Scroll & Pinned Hero:** Lenis + GSAP ScrollTrigger where the DIWAN pointed arch (`القوس`) scales up as a mask revealing the Cairo morning coffee ritual scene, with headline `قهوة تحترم حكايتها، وتجربة تستحق أن تتكرر.`
2. **5-Stage Pinned Unboxing Scrollytelling (`افتح الحكاية`):**
   - Stage 1: Closed `19×15×3.75cm` box with the `4×6cm` `افتح الحكاية` front-to-bottom seal sticker.
   - Stage 2: Lid opens to reveal the `#0E3A33` inner lid with animated SVG stroke-drawing of the Bean-to-Cup story (`بذرة، زراعة وقطف، تجفيف وتحميص وطحن؛ ثم تتفرع طرق التحضير وتلتقي في الفنجان` — showing V60, Espresso, and Turkish Cezve flowing to 3 friends including a woman in hijab in the center).
   - Stage 3: Unfolding the `#F4ECDC` tissue paper (with `#E4D9C3` repeating arch pattern) sealed with the `#A8432C` Carnelian wax seal.
   - Stage 4: Rising 9×12cm product card that flips in 3D between Front (`الوش`) and Back (`الظهر - حضّرها على ذوقك`).
   - Stage 5: Reveal of the matte white 200g zipper pouch (`الكيس الأبيض`).
3. **Interactive 9-Card Catalog & 3D Flipper:** Filterable by category, with 180-degree 3D flip to view the back recipe diagram and an interactive `ملاحظاتك:` field saved in `localStorage`.
4. **Smart Product Configurator Drawer:** Enforces the exact Turkish coffee roast matrix (disabling/omitting `فاتح` for Ons/Murad and `غامق` for Mazaj) and updates the live card checkbox preview.
5. **Interactive Brewing Timer & Ratio Guide (`حضّرها على ذوقك`):** Interactive step-by-step timer for Turkish, Espresso (25-30s shot timer), and Flavored coffee.
6. **Brand Story (`حكايتنا`), 4-Persona Coffee Finder (`الهادئ · اليومي · الهدية · المستكشف`), and Optional Ambient Brewing Sound Toggle.**
```
