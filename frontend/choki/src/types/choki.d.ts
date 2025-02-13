type ButtonSize = 'small' | 'medium' | 'large' | 'small_mid' | 'call_large';
type ButtonColor = 'orange' | 'white' | 'blue' | 'gray' | 'red' | 'white_call';
type ModalSize = 'small' | 'medium' | 'large';
type InputType = 'text' | 'password';
// 목적지 검색 input
type DestinationSearchProps = {
	map: KakaoMap | null;
};

// 카카오맵 종합 props
type MapProps = {
	showRouteRecorder?: boolean;
	showPolyline?: boolean;
	showDestinationSearch?: boolean;
	showPreviousButton?: boolean;
	showChildNavBar: boolean;
	route?: LatLng[];
	coordinates?: { latitude: number; longitude: number } | null;
	showUsersAround?: boolean;
};

// 카카오맵 실제 지도 props
type MapContainerProps = {
	onMapLoad: (map: any) => void;
};

// 카카오맵 위에 선 그리는 props
type LatLng = {
	latitude: number;
	longitude: number;
};

interface Destination {
	buildingName: string;
	latitude: number;
	longitude: number;
}

// Define a type for the RoutePolyline component props
interface RoutePolylineProps {
	map: kakao.maps.Map | null;
	route: LatLng[];
	polyline: kakao.maps.Polyline | null;
	setPolyline: React.Dispatch<React.SetStateAction<kakao.maps.Polyline | null>>;
	startMarker: kakao.maps.Marker | null;
	endMarker: kakao.maps.Marker | null;
	setStartMarker: React.Dispatch<
		React.SetStateAction<kakao.maps.Marker | null>
	>;
	setEndMarker: React.Dispatch<React.SetStateAction<kakao.maps.Marker | null>>;
}

// 카카오맵 경로 기록하는 props
type RouteRecorderProps = {
	map: any;
	setFinalRoute: (route: { latitude: number; longitude: number }[]) => void;
	onRecordingFinish: () => void;
	isRecording: boolean;
	setIsRecording: (isRecording: boolean) => void;
};

interface NearbyUserData {
	latitude: number;
	longitude: number;
	animalImage: string;
	users: Array<{
		userId: number;
		username: string;
		latitude: number;
		longitude: number;
		animalId: number;
		animalImage: string;
	}>;
}

// 카카오맵 유저 표시 props
interface UserLocationMarkerProps {
	map: any;
	coordinates?: { latitude: number; longitude: number } | null;
	nearbyUsers?: NearbyUserData;
}

type MissionType = 'SHOP' | 'RECYCLE' | 'EXTRA_MISSION';
type KakaoMaps = {
	load: () => void;
	services: {
		Geocoder: {
			new (): {
				addressSearch: (
					address: string,
					callback: (
						result: Array<{
							x: string;
							y: string;
						}>,
						status: string,
					) => void,
				) => void;
			};
		};
		Status: {
			OK: string;
			ZERO_RESULT: string;
			ERROR: string;
		};
	};
};

// 버튼 Props
interface ButtonProps {
	size: ButtonSize;
	color: ButtonColor;
	onClick?: () => void;
	text?: string;
}

//인풋창 Props
interface InputProps {
	type: InputType;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 모달 Props
interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	size: ModalSize;
	children: React.ReactNode;
}

interface nonCloseModalProps {
	children: React.ReactNode;
}

// 초대코드 모달 Props
interface InviteCodeModalProps {
	children: React.ReactNode;
}
// 회원 가입시 비밀번호 통합 관리
interface PasswordForm {
	password: string;
	passwordConfirm: string;
	isMatch: boolean;
	message: string;
}

// 현재 위치로 이동하는 버튼
interface CenterButtonProps {
	map: mapboxgl.Map | null;
}

// 우주 -> 일반 지도 시점 변화 버튼
interface TransitionToLocalViewProps {
	map: mapboxgl.Map | null;
	userLocation: [number, number] | null;
	setIsGlobeView: (value: boolean) => void;
	route: { latitude: number; longitude: number }[] | null;
}
interface AddressData {
	address: string;
	zonecode: string;
	latitude?: number; // 위도 추가
	longitude?: number; // 경도 추가
}

interface PostcodeResult {
	address: string;
	zonecode: string;
	// 다음(카카오)에서 제공하는 다른 주소 정보들도 필요하다면 여기에 추가
}
interface AddressSearchProps {
	onComplete: (data: AddressData) => void;
	onClose: () => void;
}
interface PostcodeOptions {
	oncomplete: (data: PostcodeResult) => void;
	onclose?: () => void;
	width: string;
	height: string;
}
interface Mission {
	type: MissionType;
	content: string;
}

// Unity 인터페이스
interface Window {
	UnityLoader: any; // Unity 로더 타입
	unityInstance: any; // Unity 인스턴스 타입
	receiveDataFromUnity: (data: string) => void; // Unity에서 데이터를 받을 함수 타입
	UnityReadyCallback?: () => void;
}

interface Speech {
	speech: string;
}
// 카메라 인터페이스
interface CamProps {
	onCaptureChange: (captured: RecycleResponse | undefined) => void;
	completeFlag: boolean;
}
interface BarcodeCamProps {
	onCaptureChange: (isCaptured: boolean) => void;
	originBarcode: string;
	productName: string;
	addNewItem: (newItem: ShoppingItem) => void;
	onClose: () => void;
}
// 재활용 동물 대화 인터페이스
interface AnimalSpeechProps {
	animalMessage?: string;
}

// 장보기 미션 부여를 위한 위치 정보
interface ShoppingLocation {
	latitude: number;
	longitude: number;
	buildingName: string;
}

interface RoutePoint {
	latitude: number;
	longitude: number;
}

interface RouteDetails {
	startPoint: {
		latitude: number;
		longitude: number;
	};
	destination: {
		buildingName: string;
		latitude: number;
		longitude: number;
	};
	routes: Array<{
		latitude: number;
		longitude: number;
	}>;
}

// 아이 메인 페이지 유니티로 보내는 정보
interface ChildMainUnityProps {
	level: number;
	exp: number;
	pastLevel: number;
	mainAnimal: number;
	nickname: string;
}

interface ProductCardProps {
	conpareResult: string;
	ProductName: string;
}
// AddModal 컴포넌트의 타입 정의
interface AddModalProps {
	conpareResult: string;
	ProductName: string;
	originBarcode: string; // originBarcode 속성 추가
	inputBarcode: string; // inputBarcode 속성 추가
}
