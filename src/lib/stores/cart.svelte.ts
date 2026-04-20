type CartItem = { id: number; name: string; price: number; image: string };

type CartItemWithQty = CartItem & { quantity: number };

function createCart() {
	let items = $state<CartItemWithQty[]>([]);
	let isOpen = $state(false);

	return {
		get items() {
			return items;
		},
		get isOpen() {
			return isOpen;
		},
		get total() {
			return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
		},
		get itemCount() {
			return items.reduce((sum, i) => sum + i.quantity, 0);
		},

		isInCart(id: number) {
			return items.some((i) => i.id === id);
		},

		getQuantity(id: number) {
			const item = items.find((i) => i.id === id);
			return item?.quantity ?? 0;
		},

		open() {
			isOpen = true;
		},
		close() {
			isOpen = false;
		},
		add(product: CartItem) {
			const existing = items.find((i) => i.id === product.id);
			if (existing) {
				existing.quantity++;
			} else {
				items = [...items, { ...product, quantity: 1 }];
			}
		},
		remove(product: CartItem) {
			const existing = items.find((i) => i.id === product.id);
			if (existing && existing.quantity > 1) {
				existing.quantity--;
			} else {
				items = items.filter((i) => i.id !== product.id);
			}
		},
		clear() {
			items = [];
		}
	};
}

export const cart = createCart();
