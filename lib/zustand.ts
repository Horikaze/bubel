import { create } from "zustand";
import { persist } from "zustand/middleware";
type ShowSqlStore = {
  showSql: boolean;
  toggleSql: () => void;
  setSql: (value: boolean) => void;
};

export const useShowSql = create<ShowSqlStore>()(
  persist(
    (set) => ({
      showSql: true,
      toggleSql: () => set((state) => ({ showSql: !state.showSql })),
      setSql: (value) => set({ showSql: value }),
    }),
    {
      name: "show-sql-storage",
    }
  )
);
