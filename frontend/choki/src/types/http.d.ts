//http 관련 타입; Request; Response 뒤에 붙이기
type role = 'PARENT' | 'CHILD';

// 알림이 missionId; shoppingId 모두 가질 수 있도록!
type NotificationResponse = MissionNotification | ShoppingNotification;

interface SignupRequest {
	userId: string;
	userPassword: string;
	nickname: string;
	address: string;
	latitude: number;
	longitude: number;
	name: string;
	tel: string;
	role: role;
}
interface LoginRequest {
	userId: string;
	userPassword: string;
}

interface LoginResponse {
	role: string;
}
interface InviteCodeResponse {
	inviteCode: string;
}
interface JoinFamilyResponse {
	invite_code: string;
}

interface BaseNotificationResponse {
	childId: number;
	content: string;
	type: MissionType;
	time: string;
}

interface MissionNotification extends BaseNotificationResponse {
	missionId: string;
	shoppingId: null;
}

interface ShoppingNotification extends BaseNotificationResponse {
	missionId: null;
	shoppingId: string;
}

interface ItemSearchResponse {
	barcode: string;
	category: string;
	productName: string;
	title: string;
	image: string;
	count: number;
}
interface SearchCartItem extends ItemSearchResponse {
	quantity: number;
}

interface Child {
	childId: number;
	name: string;
	nickname: string;
	level: number;
	address: string;
}

interface FamilyResponse {
	status: number;
	message: string;
	data: {
		username: string;
		children: Child[];
	};
}

interface ShoppingRequest {
	parentId: number;
	childId: number;
	startPoint: ShoppingLocation;
	destination: ShoppingLocation;
	route: RoutePoint[];
	shoppingList: ReturnType<typeof getShoppingList>;
}

interface MissionRequest {
	parentId: number;
	childId: number;
	missionType: MissionType;
	content: string;
	exp: number;
}

interface userDataResponse {
	userId: number;
	nickname: string;
	address: string;
	name: string;
	tel: string;
	role: 'PARENT' | 'CHILD';
	inviteCode: string;
	familyId: number;
	level: number;
	exp: number;
	isLevelUp: boolean;
	mainAnimalId: number;
	animals: number[];
	drawAnimalId: number;
}

interface ToUnityData {
	userId: number;
	nickname: string;
	level: number;
	exp: number;
	isLevelUp: boolean;
	mainAnimalId: number;
	animals: number[];
	drawAnimalId: number;
}
// 웹 소켓 연결 관련 타입
// 쇼핑 아이템의 구조
interface CartItem {
	barcode: string;
	category: string;
	productName: string;
	image: string;
	quantity: number;
	reason?: 'SOLD_OUT' | 'NO_REASON' | 'BLANK';
	status?: string;
}
// ProductCard에서 사용하는 Props
interface ShoppingCardProps {
	role: 'CHILD' | 'PARENTS';
	ParentsShoppingItem: {
		title: string;
		count: number;
		image: string;
	};
	ChildrenShoppingItem?: {
		title: string;
		count: number;
		image: string;
	};
	onCameraClick: () => void; // 카메라 클릭 핸들러 추가
}

interface ParentShoppingCardProps {
	ParentsShoppingItem: {
		productName: string;
		quantity: number;
		image: string;
	};
	ChildrenShoppingItem?: {
		productName: string;
		quantity: number;
		image: string;
	};
	status?: 'MATCH' | 'NOT_MATCH' | 'SIMILAR';
	reason?: 'SOLD_OUT' | 'NO_REASON' | 'BLANK';
	showWarning?: boolean;
	emptyMessage?: string;
}
interface ShoppingItem {
	barcode: string;
	category: string;
	productName: string;
	image: string;
	quantity: number;
	cartItem?: CartItem;
}

interface KidDataResponseFromParent {
	id: string;
	username: string;
	nickname: string;
	address: string;
	name: string;
	tel: string;
	role: 'PARENT' | 'CHILD';
	level: number;
	exp: number;
	pastLevel: number;
	mainAnimal: number;
}

interface InProgressMissionResponse {
	content: string;
	completedAt: string;
	image: string;
	type: MissionType;
	shoppingId: string;
}

interface conmpareRequest {
	originBarcode: string;
	inputBarcode: string;
}

interface matchStatusReponse {
	matchStatus: string;
}

interface ShoppingListResponse {
	status: number;
	matchStatus: string;
	message: string;
}

// 미션
interface MissionDetailResponse {
	content: string;
	completedAt: string; // 2024-10-25;
	status: string;
	type: MissionType;
	image: string;
	comment: string;
}

interface MissionAcceptRequest {
	missionId: string;
	comment: string;
}

interface DoneMissionResponse {
	content: string;
	completedAt: string; //2024-10-25;
	image: string;
	type: string;
	shoppingId: string;
	missionId: string;
}

interface RecycleResponse {
	image: DetectionImage; // 처리된 이미지
	predictions: DetectionResult[]; // 객체 탐지 결과
}

interface DetectionImage {
	data: string;
	height: number;
	width: number;
}

interface DetectionResult {
	xmin: number;
	ymin: number;
	xmax: number;
	ymax: number;
	confidence: number;
	class: number;
	name: string;
}
