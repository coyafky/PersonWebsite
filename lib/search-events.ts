type Listener = () => void;

let openSearch: Listener | null = null;

export function onOpenSearch(listener: Listener) {
  openSearch = listener;
  return () => {
    if (openSearch === listener) openSearch = null;
  };
}

export function triggerSearch() {
  openSearch?.();
}
