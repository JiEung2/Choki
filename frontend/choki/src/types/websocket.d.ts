// 웹 소켓 응답 type 분리
type WSShoppingType =
	| 'SHOPPING'
	| 'ADD_PRODUCT_TO_CART'
	| 'DELETE_PRODUCT_FROM_CART'
	| 'HINT_MESSAGE';

// 기본 메시지 타입 (공통 필드)
interface BaseWSMessage {
	type: WSShoppingType;
}

// 쇼핑 리스트
interface ShoppingListResponse extends BaseWSMessage {
	type: 'SHOPPING';
	id: string;
	parentId: number;
	childId: number;
	startPoint: ShoppingLocation;
	destination: ShoppingLocation;
	routes: RoutePoint[];
	shoppingList: ShoppingItem[];
	missionId: string;
	status: string;
}

// 장바구니 추가
interface AddToCartResponse extends BaseWSMessage {
	type: 'ADD_PRODUCT_TO_CART';
	listBarcode?: string;
	category: string;
	barcode?: string;
	productName?: string;
	image?: string;
	quantity?: number;
	reason?: 'SOLD_OUT' | 'NO_REASON' | 'BLANK';
	status?: string;
	cartItem?: CartItem;
}

// 장바구니 삭제
interface DeleteFromCartResponse extends BaseWSMessage {
	type: 'DELETE_PRODUCT_FROM_CART';
	listBarcode: string;
	barcode: string;
}

// 힌트 메시지
interface HintMessageResponse extends BaseWSMessage {
	type: 'HINT_MESSAGE';
	message: string;
}

// 통합 응답 타입
type WSShoppingResponse =
	| ShoppingListResponse
	| AddToCartResponse
	| DeleteFromCartResponse
	| HintMessageResponse;

interface addShoppingItem {
	shoppingId: string;
	listBarcode: string;
	barcode: string;
	quantity: number;
	reason: addReason;
}
