import { create } from "zustand";
import { persist } from "zustand/middleware";
type ShowSqlStore = {
  showSql: boolean;
  toggleSql: () => void;
  setSql: (value: boolean) => void;
};

export type CartItem = {
  gameId: number;
  gameName: string;
  price: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (gameId: number) => void;
  setQuantity: (gameId: number, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
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

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const idx = state.items.findIndex((i) => i.gameId === item.gameId);
          if (idx >= 0) {
            const items = state.items.slice();
            items[idx] = {
              ...items[idx],
              quantity: items[idx].quantity + quantity,
            };
            return { items };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      removeItem: (gameId) =>
        set((state) => ({
          items: state.items.filter((i) => i.gameId !== gameId),
        })),
      setQuantity: (gameId, quantity) =>
        set((state) =>
          quantity <= 0
            ? { items: state.items.filter((i) => i.gameId !== gameId) }
            : {
                items: state.items.map((i) =>
                  i.gameId === gameId ? { ...i, quantity } : i
                ),
              }
        ),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);
