import { create } from "zustand";

export type View = "analytics" | "users" | "village-browser" | "logs" | "portal" | "docs";

type UiState = {
  view: View;
  setView: (view: View) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  view: "analytics",
  setView: (view) => set({ view }),
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed })
}));
