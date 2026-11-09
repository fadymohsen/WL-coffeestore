"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/store/useCatalogStore";
import { useShopStore } from "@/store/useShopStore";

/** Loads the saved catalog and orders after mount, so server and first client render match. */
export default function StoreHydrator() {
  useEffect(() => {
    void useCatalogStore.persist.rehydrate();
    void useShopStore.persist.rehydrate();
  }, []);
  return null;
}
