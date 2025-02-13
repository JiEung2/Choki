import { atom } from 'jotai';

// shoppingList Atom 정의
export const shoppingListAtom = atom<ShoppingItem[]>([]);
export const shoppingMessageAtom = atom<string>('');
export const shoppingIdAtom = atom<string | null>(null);
// shoppingList에 새로운 아이템을 추가하는 함수
export const addShoppingItem = (
	set: (update: (prev: ShoppingItem[]) => ShoppingItem[]) => void,
	newItem: ShoppingItem,
) => {
	set((prevList: ShoppingItem[]) => [...prevList, newItem]);
};

// 특정 barcode의 cartItem을 업데이트하는 함수
export const updateCartItemInShoppingList = (
	set: (update: (prev: ShoppingItem[]) => ShoppingItem[]) => void,
	barcode: string,
	updatedCartItem: CartItem,
) => {
	set((prevList: ShoppingItem[]) =>
		prevList.map((item: ShoppingItem) =>
			item.barcode === barcode ? { ...item, cartItem: updatedCartItem } : item,
		),
	);
};

// 특정 barcode의 cartItem을 삭제하는 함수
// 특정 barcode의 cartItem을 삭제하고, productName이 빈 문자열인 ShoppingItem을 삭제하는 함수
export const deleteCartItem = (
	set: (update: (prev: ShoppingItem[]) => ShoppingItem[]) => void,
	barcode: string, // 부모의 바코드
) => {
	set((prevList: ShoppingItem[]) =>
		prevList.map((item: ShoppingItem) =>
			item.barcode === barcode ? { ...item, cartItem: undefined } : item,
		),
	);
};

// 아이가 추가한 물품 삭제 메서드

export const deletePlusItem = (
	set: (update: (prev: ShoppingItem[]) => ShoppingItem[]) => void,
	barcode: string, // 아이의 바코드
) => {
	set((prevList: ShoppingItem[]) =>
		prevList.filter(
			(item: ShoppingItem) =>
				!(
					item.productName === '' &&
					item.cartItem &&
					item.cartItem.barcode === barcode
				),
		),
	);
};
// shoppingMessageAtom의 메시지를 업데이트하는 함수
export const updateShoppingMessage = (
	setMessage: (update: (prev: string) => string) => void,
	newMessage: string,
) => {
	setMessage(() => newMessage);
};
