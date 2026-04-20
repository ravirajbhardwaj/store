type CartItem = { id: number; name: string; price: number; image: string };

function createCart() {
	let items = $state<CartItem[]>([]);
	let isOpen = $state(false);

	return {
		get items() {
			return items;
		},
		get isOpen() {
			return isOpen;
		},
		get total() {
			return items.reduce((sum, i) => sum + i.price, 0);
		},

		isInCart(id: number) {
			return items.some((i) => i.id === id);
		},

		open() {
			isOpen = true;
		},
		close() {
			isOpen = false;
		},
		add(product: CartItem) {
			items = [...items, product];
		},
		remove(product: CartItem) {
			items = items.filter((i) => i.id !== product.id);
		}
	};
}

export const cart = createCart();
