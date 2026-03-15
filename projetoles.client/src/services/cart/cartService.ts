export interface CartItem {
  productUuid: string;
  quantity: number;
}

const CART_KEY = "pharma_cart";

const sanitize = (items: CartItem[]): CartItem[] => {
  return items
    .filter((item) => item.productUuid && item.quantity > 0)
    .map((item) => ({
      productUuid: item.productUuid,
      quantity: Math.max(1, Math.floor(item.quantity)),
    }));
};

const read = (): CartItem[] => {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? sanitize(parsed) : [];
  } catch {
    return [];
  }
};

const write = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(sanitize(items)));
  window.dispatchEvent(new Event("pharma-cart-updated"));
};

export const cartService = {
  getItems(): CartItem[] {
    return read();
  },

  addItem(productUuid: string, amount = 1) {
    const items = read();
    const existing = items.find((item) => item.productUuid === productUuid);

    if (existing) {
      existing.quantity += Math.max(1, Math.floor(amount));
      write(items);
      return;
    }

    items.push({ productUuid, quantity: Math.max(1, Math.floor(amount)) });
    write(items);
  },

  updateQuantity(productUuid: string, quantity: number) {
    const items = read();
    const index = items.findIndex((item) => item.productUuid === productUuid);
    if (index < 0) return;

    if (quantity <= 0) {
      items.splice(index, 1);
    } else {
      items[index].quantity = Math.max(1, Math.floor(quantity));
    }

    write(items);
  },

  removeItem(productUuid: string) {
    const items = read().filter((item) => item.productUuid !== productUuid);
    write(items);
  },

  clear() {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event("pharma-cart-updated"));
  },
};
