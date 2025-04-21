import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMenuStore = create(
  persist(
    (set) => ({
      isMenuOpen: true,
      togleMenu: (text) =>
        set((state) => ({
          isMenuOpen: !state.isMenuOpen,
        })),
      // Function to clear persisted storage
      clearStorage: () => {
        set({ isMenuOpen: true }); // Clear the store's in-memory state
        localStorage.removeItem('menu-storage'); // Clear localStorage
      },
    }),
    {
      name: 'menu-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useMenuStore;
