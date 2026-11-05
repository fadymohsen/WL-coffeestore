import Link from "next/link";

const LINKS = [
  { href: "/shop", label: "المتجر" },
  { href: "/our-story", label: "حكايتنا" },
];

export default function Footer() {
  return (
    <footer className="border-t border-n200 bg-green text-sandy">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-20">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <span className="font-editorial text-2xl font-bold">DIWAN</span>
            <p className="mt-1 font-arabic text-sm text-sandy/60">ديوان</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sandy/70">
              الديوان هو مجلس ومكان اجتماع. نأخذ هذا الإحساس إلى القهوة اليومية: طقوس مألوفة،
              تفاصيل محسوبة، وتوليفات سهلة الاختيار.
            </p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-sandy/50">
              A place to gather. We bring this feeling to everyday coffee: familiar rituals,
              thoughtful details, and easy choices.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-sandy/50">
              الروابط
            </h4>
            <nav className="flex flex-col gap-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-arabic text-sm text-sandy/70 transition hover:text-sandy"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-sandy/50">
              تواصل معنا
            </h4>
            <div className="space-y-2 text-sm text-sandy/70">
              <p>hello@diwan.coffee</p>
              <p>القاهرة، مصر</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-sandy/15 pt-6 text-xs text-sandy/40 md:flex-row">
          <p>&copy; 2025 DIWAN Coffee. All rights reserved.</p>
          <p className="font-arabic">قهوة لكل ثقافة · Coffee for Every Culture</p>
        </div>
      </div>
    </footer>
  );
}
