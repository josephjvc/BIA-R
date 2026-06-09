import { useSyncExternalStore } from "react";

let query = "";
let context = "global";
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
const emit = () => listeners.forEach(cb => cb());

export function setSearch(q: string) { query = q; emit(); }
export function setSearchContext(c: string) {
  if (c === context) return;
  context = c;
  query = ""; // reset query when context changes
  emit();
}
export function useSearch() {
  return useSyncExternalStore(subscribe, () => query, () => query);
}
export function useSearchContext() {
  return useSyncExternalStore(subscribe, () => context, () => context);
}
