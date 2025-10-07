import { create } from "zustand";
import api from "../lib/api";

export const useWalletStore = create((set, get) => ({
  balance: 0,
  loading: false,
  error: null,

  txns: [],
  txLoading: false,
  txError: null,

  fetchBalance: async (userId) => {
    if (!userId) return;
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/api/wallets/${userId}`);
      const balance = res.data?.balance ?? 0;
      set({ balance, loading: false });
    } catch (e) {
      set({ error: e?.message || "Fetch balance failed", loading: false });
    }
  },

  fetchTransactions: async (userId, take = 20) => {
    if (!userId) return;
    set({ txLoading: true, txError: null });
    try {
      // BE nên trả về mảng [{ createdAt, type, amount, balanceAfter, note, paymentId, ... }]
      const res = await api.get(`/api/wallets/history`, { params: { userId, take } });
      // fallback nếu BE trả fields khác
      const list = Array.isArray(res.data) ? res.data : (res.data?.items || []);
      // sort client: mới → cũ
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      set({ txns: list, txLoading: false });
    } catch (e) {
      set({ txError: e?.message || "Fetch transactions failed", txLoading: false });
    }
  },
}));
