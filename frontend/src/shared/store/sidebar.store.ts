import { create } from "zustand";

interface SidebarState {
  navOpen: boolean;
  mobileNavOpen: boolean;
  activityPanelOpen: boolean;
  setNavOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setActivityPanelOpen: (open: boolean) => void;
  toggleNav: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  navOpen: true,
  mobileNavOpen: false,
  activityPanelOpen: false,

  setNavOpen: (open) => set({ navOpen: open }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setActivityPanelOpen: (open) => set({ activityPanelOpen: open }),
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
}));
