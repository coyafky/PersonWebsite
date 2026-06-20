type Listener = () => void;

let openSearch: Listener | null = null;

export function onOpenSearch(listener: Listener) {
  openSearch = listener;
}

export function triggerSearch() {
  openSearch?.();
}
