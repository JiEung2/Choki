import { useState, CSSProperties } from 'react';
import NonCloseModal from '../Common/Modal/nonCloseModal';
import Image from 'next/image';

import Button from '@/components/Common/Button';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';
import { useAtom } from 'jotai';
import { shoppingIdAtom } from '@/atoms/shoppingAtom';

interface AddModalProps {
	compareResult: string;
	ProductName: string;
	originBarcode: string;
	inputBarcode: string;
	onClose: () => void; // 모달 닫기 함수 추가
}

export default function AddModal({
	compareResult: compareResult,
	ProductName,
	originBarcode,
	inputBarcode,
	onClose, // 모달 닫기 prop
}: AddModalProps) {
	const buttonStyle = {
		backgroundColor: '#f0f0f0',
		border: 'none',
		borderRadius: '50%',
		width: '40px',
		height: '40px',
		fontSize: '20px',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	};

	const quantityStyle: CSSProperties = {
		padding: '5px 10px',
		borderRadius: '10px',
		backgroundColor: '#fff',
		fontSize: '20px',
		fontWeight: 'bold',
		textAlign: 'center',
		minWidth: '40px',
	};

	const [quantity, setQuantity] = useState(1);

	const increaseQuantity = () => setQuantity(prevQuantity => prevQuantity + 1);
	const decreaseQuantity = () =>
		setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
	const [missionId] = useAtom(shoppingIdAtom);
	const sendWebSocketData = (reason: string) => {
		const requestBody = {
			shoppingId: missionId,
			listBarcode: originBarcode,
			barcode: inputBarcode,
			// barcode: '88002903',
			quantity: quantity,
			reason: reason,
		};
		console.log('아이 장바구니 물품 추가하기:', requestBody);
		childWebSocketClient.sendMessage('/pub/shopping/product/add', requestBody);
		onClose(); // WebSocket 데이터 전송 후 모달 닫기
	};

	const handleMatchButton = () => sendWebSocketData('MATCH');
	const handleSoldOutButton = () => sendWebSocketData('SOLD_OUT');
	const handleNoReasonButton = () => sendWebSocketData('NO_REASON');
	const handleNotMatchButton = () => onClose();

	return (
		<div>
			<NonCloseModal>
				<div className="flex flex-col items-center p-6">
					{compareResult === 'MATCH' && (
						<div className="flex flex-col items-center mt-12">
							<Image
								src="/icons/success_icon.svg"
								alt="Success"
								width={80}
								height={80}
							/>
							<p className="mt-4 text-lg font-semibold text-center">
								<strong>{ProductName ? ProductName : '새로 담은 상품'}</strong>
								을/를
								<br />몇 개 담을 건가요?
							</p>
							<div className="flex items-center gap-4 mt-4">
								<button onClick={decreaseQuantity} style={buttonStyle}>
									-
								</button>
								<div style={quantityStyle}>{quantity}</div>
								<button onClick={increaseQuantity} style={buttonStyle}>
									+
								</button>
							</div>
							<div className="mt-6">
								<Button
									size="small"
									color="orange"
									text="담기"
									onClick={handleMatchButton}
								/>
							</div>
						</div>
					)}
					{compareResult === 'NOT_MATCH' && (
						<div className="flex flex-col items-center mt-12">
							<Image
								src="/icons/fail_icon.svg"
								alt="Fail"
								width={80}
								height={80}
							/>
							<p className="mt-4 text-lg font-semibold text-center">
								<strong>{ProductName}</strong>이(가) 맞나요?
								<br />
								다른 상품을 담아보세요.
							</p>
							<div className="mt-6">
								<Button
									size="small"
									color="orange"
									text="돌아가기"
									onClick={handleNotMatchButton}
								/>
							</div>
						</div>
					)}
					{compareResult === 'SIMILAR' && (
						<div className="flex flex-col items-center mt-12">
							<Image
								src="/icons/warning_icon.svg"
								alt="Warning"
								width={80}
								height={80}
							/>
							<p className="mt-4 text-lg font-semibold text-center">
								<strong>{ProductName}</strong>을/를
								<br />몇 개 담으실 건가요?
							</p>
							<div className="flex items-center gap-4 mt-4">
								<button onClick={decreaseQuantity} style={buttonStyle}>
									-
								</button>
								<div style={quantityStyle}>{quantity}</div>
								<button onClick={increaseQuantity} style={buttonStyle}>
									+
								</button>
							</div>
							<div className="flex gap-4 mt-6 w-full">
								<div className="mt-6 w-1/2">
									<Button
										size="small_mid"
										color="gray"
										text="품절"
										onClick={handleSoldOutButton}
									/>
								</div>
								<div className="mt-6 w-1/2">
									<Button
										size="small_mid"
										color="gray"
										text="이유없음"
										onClick={handleNoReasonButton}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</NonCloseModal>
		</div>
	);
}
