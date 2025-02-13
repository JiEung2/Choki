import * as Stomp from '@stomp/stompjs';
import {
	updateCartItemInShoppingList,
	updateShoppingMessage,
	addShoppingItem,
} from '@/atoms/shoppingAtom';

// WebSocket 메시지를 처리하는 함수
export const handleWebSocketMessage = (
	message: Stomp.Message,
	setShoppingList: (update: (prev: CartItem[]) => CartItem[]) => void,
	setShoppingMessage: (update: (prev: string) => string) => void,
) => {
	const data = JSON.parse(message.body);
	console.log('WebSocket message received:', data);
	if (data && data.shoppingList) {
		setShoppingList(data.shoppingList);
	}
	switch (data.type) {
		case 'ADD_PRODUCT_TO_CART':
			const updatedCartItem: CartItem = {
				barcode: data.barcode,
				category: data.category,
				productName: data.productName,
				image: data.image,
				quantity: data.quantity,
				reason: data.reason,
				status: data.status,
			};
			// 기존에 없던 상품이면 추가하기
			if (data.listBarcode === '') {
				const addParentItem: ShoppingItem = {
					barcode: '',
					category: '',
					productName: '',
					image: '',
					quantity: 0,
					cartItem: updatedCartItem,
				};
				addShoppingItem(setShoppingList, addParentItem);
			} else {
				// 웹 소켓으로 데이터 갱신을 받을 경우 바로 jotai를 통해 업데이트하도록
				updateCartItemInShoppingList(
					setShoppingList,
					data.listBarcode,
					updatedCartItem,
				);
			}

			break;

		case 'HINT_MESSAGE':
			// HINT_MESSAGE 타입의 메시지일 경우 shoppingMessageAtom에 메시지 설정
			if (data.message) {
				updateShoppingMessage(setShoppingMessage, data.message);
			}
			break;
	}
};
