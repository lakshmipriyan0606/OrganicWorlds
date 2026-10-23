import { Product, ProductVariant } from "./product";

export interface CartItem {
  id: string; // composite key: productId-variantId
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
}

export interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  isFreeShipping: boolean;
}
