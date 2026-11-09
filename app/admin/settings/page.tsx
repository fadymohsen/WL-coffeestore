"use client";

import { useState } from "react";
import { PageHead, btnDark, card, input } from "@/components/admin/AdminShell";
import { useCatalogStore, type StoreSettings } from "@/store/useCatalogStore";
import { useToastStore } from "@/store/useToastStore";
import { useLocalized } from "@/lib/i18n";

export default function SettingsPage() {
  const l = useLocalized();
  const settings = useCatalogStore((s) => s.settings);
  const update = useCatalogStore((s) => s.updateSettings);
  const push = useToastStore((s) => s.push);
  const [draft, setDraft] = useState<StoreSettings>(settings);
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);
  const set = (k: keyof StoreSettings) => (e: { target: { value: string } }) => setDraft({ ...draft, [k]: e.target.value });

  const save = () => {
    update({ ...draft, orderPrefix: draft.orderPrefix.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6) || "DW" });
    push(l({ en: "Settings saved", ar: "تم حفظ الإعدادات" }));
  };

  return (
    <>
      <PageHead title={l({ en: "Settings", ar: "الإعدادات" })} action={<button className={btnDark} onClick={save} disabled={!dirty}>{l({ en: "Save changes", ar: "حفظ التغييرات" })}</button>} />
      <div className="max-w-2xl space-y-4">
        <section className={`${card} grid gap-4 p-5 sm:grid-cols-2`}>
          <h2 className="text-sm font-semibold sm:col-span-2">{l({ en: "Store", ar: "المتجر" })}</h2>
          <label className="text-sm font-medium">{l({ en: "Store name", ar: "اسم المتجر" })}<input className={`${input} mt-1`} value={draft.storeName} onChange={set("storeName")} /></label>
          <label className="text-sm font-medium">{l({ en: "Order number prefix", ar: "بادئة رقم الطلب" })}<input className={`${input} mt-1`} value={draft.orderPrefix} onChange={set("orderPrefix")} dir="ltr" maxLength={6} /><span className="mt-1 block text-xs font-normal text-[#616161]">{l({ en: "Next order looks like", ar: "الطلب القادم يبدو هكذا" })} <bdi>{(draft.orderPrefix || "DW").toUpperCase()}-1001</bdi></span></label>
        </section>
        <section className={`${card} grid gap-4 p-5 sm:grid-cols-2`}>
          <h2 className="text-sm font-semibold sm:col-span-2">{l({ en: "Contact details shown to customers", ar: "بيانات التواصل التي تظهر للعملاء" })}</h2>
          <label className="text-sm font-medium">{l({ en: "Phone", ar: "الهاتف" })}<input className={`${input} mt-1`} value={draft.phone} onChange={set("phone")} dir="ltr" /></label>
          <label className="text-sm font-medium">WhatsApp<input className={`${input} mt-1`} value={draft.whatsapp} onChange={set("whatsapp")} dir="ltr" /></label>
          <label className="text-sm font-medium sm:col-span-2">{l({ en: "Support email", ar: "البريد الإلكتروني للدعم" })}<input type="email" className={`${input} mt-1`} value={draft.supportEmail} onChange={set("supportEmail")} dir="ltr" /></label>
          <p className="text-xs text-[#616161] sm:col-span-2">{l({ en: "These appear on the contact page and the footer once filled in.", ar: "تظهر في صفحة التواصل والتذييل بمجرد تعبئتها." })}</p>
        </section>
      </div>
    </>
  );
}
