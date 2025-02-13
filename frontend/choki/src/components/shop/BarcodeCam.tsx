import React, { useRef, useEffect, useState } from 'react';
import Button from '../Common/Button';
import { BrowserMultiFormatReader } from '@zxing/browser';
import AddModal from './AddModal';
import { Toast } from '@/components/Toast/Toast';
import { compareShopping } from '@/lib/api/shopping';

// Extended interface for zoom support

const Cam: React.FC<BarcodeCamProps> = ({
	onCaptureChange,
	originBarcode,
	productName,
	onClose,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [compareResult, setCompareResult] = useState<string | null>(null);
	const [inputBarcode, setInputBarcode] = useState<string | null>(null);
	const [showToast, setShowToast] = useState<string | null>(null);
	const [hasPermission, setHasPermission] = useState<boolean>(false); // 권한 상태
	const [barcodeReader] = useState(new BrowserMultiFormatReader());

	// 권한 상태 확인 및 요청
	const checkCameraPermission = async () => {
		try {
			const permission = await navigator.permissions.query({
				name: 'camera' as PermissionName,
			});

			if (permission.state === 'denied') {
				setHasPermission(false);
				throw new Error('카메라 권한이 거부되었습니다.');
			} else {
				setHasPermission(true);
			}
		} catch (error) {
			console.error('권한 확인 실패:', error);
			setShowToast('카메라 권한을 허용해주세요.');
			setHasPermission(false);
			throw error;
		}
	};

	const getRearCameraStream = async (): Promise<MediaStream> => {
		try {
			// 특정 deviceId 지정 (Device 4: camera2 0, facing back)
			const targetDeviceId =
				'687e92c404c067d9a9032fdc5a5fe77586531a3ae2477a69a272346598bdbc17';

			// 스트림 생성
			const constraints: MediaStreamConstraints = {
				video: {
					deviceId: targetDeviceId,
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
			};

			// 선택된 카메라로 스트림 반환
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			console.log(`Selected Camera: Device 4 (ID: ${targetDeviceId})`);
			return stream;
		} catch (error) {
			console.error('카메라 선택 실패:', error);
			throw error;
		}
	};

	// 바코드 비교 함수
	const goCompare = async (originBarcode: string, inputBarcode: string) => {
		try {
			if (!originBarcode) {
				setCompareResult('MATCH');
				setInputBarcode(inputBarcode);
			} else {
				const response = await compareShopping({ originBarcode, inputBarcode });
				setCompareResult(response.matchStatus);
				setInputBarcode(inputBarcode);
			}
		} catch (error) {
			console.error('장보기 비교 실패:', error);
		}
	};

	// 스캔 시작
	const startScan = async () => {
		if (videoRef.current) {
			try {
				const stream = await getRearCameraStream();
				videoRef.current.srcObject = stream;

				barcodeReader.decodeFromVideoElement(videoRef.current, result => {
					if (result) {
						const scannedBarcode = result.getText();
						goCompare(originBarcode, scannedBarcode);
						stream.getTracks().forEach(track => track.stop());
					}
				});
			} catch (error) {
				console.error('카메라 접근 실패:', error);
				setShowToast(
					'카메라를 사용할 수 없습니다. 권한을 확인하거나 재시도해주세요.',
				);
			}
		}
	};

	useEffect(() => {
		const checkPermissionsAndStart = async () => {
			try {
				await checkCameraPermission();
				if (hasPermission) {
					await startScan();
				}
			} catch (error) {
				console.error('카메라 권한 부족 또는 접근 실패:', error);
				setShowToast('기기에서 카메라 권한을 허용해주세요.');
			}
		};

		checkPermissionsAndStart();

		return () => {
			if (videoRef.current) {
				const stream = videoRef.current.srcObject as MediaStream;
				stream?.getTracks().forEach(track => track.stop());
			}
		};
	}, [barcodeReader, originBarcode, hasPermission]);

	const handleConfirm = () => {
		onCaptureChange(true);
	};

	return (
		<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg mx-auto w-[80%] max-w-lg">
			{compareResult ? (
				<AddModal
					compareResult={compareResult}
					ProductName={productName || '새로 담은 상품'}
					originBarcode={originBarcode}
					inputBarcode={inputBarcode || ''}
					onClose={onClose}
				/>
			) : (
				<>
					<div className="relative mb-4 w-full flex justify-center">
						<video
							ref={videoRef}
							autoPlay
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none"></div>
						<div className="absolute inset-0 flex justify-center items-center pointer-events-none">
							<div className="border-2 border-orange-300 w-[80%] h-[20%]">
								<span className="text-white mt-2 text-sm bg-opacity-50 px-2 py-1 rounded">
									바코드를 박스 안에 맞춰주세요
								</span>
							</div>
						</div>
					</div>

					<div className="flex gap-4 mt-4">
						<Button
							size="small"
							color="blue"
							onClick={handleConfirm}
							text="돌아가기"
						/>
					</div>
				</>
			)}

			{showToast && (
				<Toast
					message="카메라를 사용할 수 없습니다. 권한을 확인하거나 재시도해주세요."
					onClose={() => setShowToast(null)}
				/>
			)}
		</div>
	);
};

export default Cam;
