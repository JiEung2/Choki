import Modal from '@/components/Common/Modal/nonCloseModalLarge';
import Navbar from '@/components/Common/Navbar/YellowUpperNavbar';
import Image from 'next/image';
import SpeechBubble from '@/components/shop/SpeechBubble';
import ProductCard from '@/components/shop/ProductCard';
import Cam from '@/components/shop/BarcodeCam';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import {
	shoppingListAtom,
	deleteCartItem,
	shoppingMessageAtom,
	shoppingIdAtom,
} from '@/atoms/shoppingAtom';
import { useEffect, useState } from 'react';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';
import { handleWebSocketMessage } from '@/lib/utils/websocketChild/ChildShoppingSoket';
import AddItemPrompt from '@/components/shop/AddItemPrompt';

export default function ChildShoppingPage() {
	const [shoppingList, setShoppingList] = useAtom(shoppingListAtom);
	const [shoppingMessage, setShoppingMessage] = useAtom(shoppingMessageAtom);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [originBarcode, setOriginBarcode] = useState<string | null>(null);
	const [productName, setProductName] = useState<string | null>(null);
	const router = useRouter();
	const [, setShoppingId] = useAtom(shoppingIdAtom);
	const { missionId } = router.query; //
	// const [isLoading, setIsLoading] = useState(true);

	// WebSocket 구독 및 메시지 처리
	useEffect(() => {
		console.log('구독시 missionId:', missionId);
		if (missionId !== undefined && typeof missionId === 'string') {
			setShoppingId(missionId);
			childWebSocketClient.subscribe(
				`/user/sub/shopping/${missionId}`,
				message =>
					handleWebSocketMessage(message, setShoppingList, setShoppingMessage),
			);
		}
		return () => {
			childWebSocketClient.disconnect();
		};
	}, [missionId, setShoppingList]);
	useEffect(() => {
		console.log('장바구니 변경:', shoppingList);
	}, [shoppingList]);
	const openCameraModal = (barcode: string = '', name: string = '') => {
		setOriginBarcode(barcode);
		setProductName(name);
		setIsCameraOpen(true);
	};

	const closeCameraModal = () => {
		setIsCameraOpen(false);
		setOriginBarcode(null);
		setProductName(null);
	};

	const addNewItemToShoppingList = (newItem: CartItem) => {
		setShoppingList(prevList => [...prevList, newItem]);
	};

	const deleteItemFromShoppingList = (barcode: string) => {
		// 부모가 추가한 물품을 삭제
		deleteCartItem(setShoppingList, barcode);
	};

	return (
		<div
			className="relative flex flex-col items-center min-h-screen bg-cover bg-center"
			style={{
				backgroundImage: `url('/icons/mart_background.svg')`,
			}}
		>
			<div className="mt-8">
				<Navbar missionId={missionId as string} />
			</div>
			<div className="flex flex-col items-center justify-start mt-16">
				{isCameraOpen ? (
					<Cam
						onCaptureChange={closeCameraModal}
						originBarcode={originBarcode || ''}
						productName={productName || ''}
						onClose={closeCameraModal}
						addNewItem={addNewItemToShoppingList}
					/>
				) : (
					<Modal>
						<div
							className="flex flex-col items-center"
							style={{
								maxHeight: '70vh', // 모달 높이를 70% 뷰포트 높이로 제한
								overflowY: 'auto', // 내용이 넘칠 경우 스크롤 가능
							}}
						>
							<h1 className="text-2xl font-bold mb-6">장바구니</h1>
							{shoppingList.map((item, index) => (
								<ProductCard
									key={`${item.barcode}-${index}`} // barcode와 index를 조합해 고유 키 생성
									role="CHILD"
									ParentsShoppingItem={{
										title: item.productName,
										count: item.quantity,
										image: item.image,
										barcode: item.barcode,
									}}
									ChildrenShoppingItem={
										item.cartItem
											? {
													productName: item.cartItem.productName,
													quantity: item.cartItem.quantity,
													image: item.cartItem.image,
													barcode: item.cartItem?.barcode || '',
												}
											: undefined
									}
									onCameraClick={() =>
										openCameraModal(item.barcode, item.productName)
									}
									onDelete={deleteItemFromShoppingList}
								/>
							))}
							{/* 항상 표시되는 추가 UI 요소 */}
							<AddItemPrompt onClick={() => openCameraModal()} />
						</div>
					</Modal>
				)}
			</div>

			{shoppingMessage && (
				<div className="absolute bottom-8 right-32">
					<SpeechBubble speech={shoppingMessage} />
				</div>
			)}
			<Image
				src="/icons/shopping_character.svg"
				alt="장보기 캐릭터"
				className="absolute bottom-4 right-4 z-50" // bottom 값을 줄여 캐릭터가 화면 안에 잘 표시되도록 설정
				width={70}
				height={70}
			/>
		</div>
	);
}
