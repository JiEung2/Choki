import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { uploadShoppingImage } from '@/lib/api/shopping';
import { useRouter } from 'next/router';
import { Toast } from '@/components/Toast/Toast';

interface ShoppingFinishComponentProps {
	missionId: string;
}

const ShoppingCompleteModal: React.FC<ShoppingFinishComponentProps> = ({
	missionId,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [capturedImage, setCapturedImage] = useState<File | null>(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const [imageDimensions, setImageDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);
	const [isCaptured, setIsCaptured] = useState(false);
	const [cameraError, setCameraError] = useState(false);
	const [hasPermission, setHasPermission] = useState<boolean>(false);
	const [showToast, setShowToast] = useState<string | null>(null);
	const router = useRouter();

	// 카메라 권한 확인 및 요청
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
			// 기본적인 후면 카메라 설정
			const constraints: MediaStreamConstraints = {
				video: {
					// facingMode: { exact: 'environment' }, // 후면 카메라 강제 설정
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
			};

			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			return stream;
		} catch (firstError) {
			console.error('후면 카메라 접근 실패, 일반 카메라로 시도:', firstError);

			// 첫 시도 실패시 덜 제한적인 설정으로 재시도
			try {
				const fallbackConstraints: MediaStreamConstraints = {
					video: {
						// facingMode: 'environment', // exact 없이 더 유연하게 설정
						width: { ideal: 1280 },
						height: { ideal: 720 },
					},
				};

				const fallbackStream =
					await navigator.mediaDevices.getUserMedia(fallbackConstraints);
				return fallbackStream;
			} catch (error) {
				console.error('카메라 접근 실패:', error);
				throw error;
			}
		}
	};

	// 카메라 시작
	const startCamera = async () => {
		try {
			await checkCameraPermission();
			if (!hasPermission) return;

			const stream = await getRearCameraStream();
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (error) {
			console.error('카메라 초기화 실패:', error);
			setCameraError(true);
			setShowToast(
				'카메라를 사용할 수 없습니다. 권한을 확인하거나 재시도해주세요.',
			);
		}
	};

	const captureImage = () => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (canvas && video) {
			const context = canvas.getContext('2d');
			if (context) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				context.drawImage(video, 0, 0, canvas.width, canvas.height);

				canvas.toBlob(blob => {
					if (blob) {
						const file = new File([blob], 'capture.png', { type: 'image/png' });
						setCapturedImage(file);
						setImageDimensions({ width: canvas.width, height: canvas.height });
						setIsCaptured(true);

						// 캡처 후 카메라 스트림 정리
						const stream = video.srcObject as MediaStream;
						if (stream) {
							stream.getTracks().forEach(track => track.stop());
						}
					}
				}, 'image/png');
			}
		}
	};

	const confirmAndUploadImage = () => {
		if (capturedImage) {
			uploadShoppingImage(missionId, capturedImage)
				.then(() => {
					resetCapture();
					router.push('/child/main');
				})
				.catch(error => {
					console.error('이미지 업로드 실패:', error);
					setShowToast('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
				});
		}
	};

	const resetCapture = () => {
		setIsCaptured(false);
		setCapturedImage(null);
		setImagePreviewUrl(null);
		startCamera();
	};

	useEffect(() => {
		if (capturedImage) {
			const objectUrl = URL.createObjectURL(capturedImage);
			setImagePreviewUrl(objectUrl);
			return () => URL.revokeObjectURL(objectUrl);
		}
	}, [capturedImage]);

	useEffect(() => {
		const initializeCamera = async () => {
			try {
				await startCamera();
			} catch (error) {
				console.error('카메라 초기화 실패:', error);
				setShowToast('카메라 초기화에 실패했습니다. 다시 시도해주세요.');
			}
		};

		initializeCamera();

		return () => {
			if (videoRef.current) {
				const stream = videoRef.current.srcObject as MediaStream;
				stream?.getTracks().forEach(track => track.stop());
			}
		};
	}, [hasPermission]);

	return (
		<div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow-lg max-w-xs mx-auto">
			<div className="relative flex items-center">
				<div className="mr-4 p-2 bg-light_yellow text-sm rounded-lg shadow-md">
					<p>
						장보기를 마무리할래?
						<br />
						인증 사진을 찰칵~!
					</p>
				</div>

				<div className="w-20 h-20">
					<Image
						src="/icons/dog_character.svg"
						alt="Animal Character"
						width={80}
						height={80}
					/>
				</div>
			</div>

			<div className="relative w-40 h-52 bg-gray-200 rounded-lg overflow-hidden">
				{imagePreviewUrl ? (
					<Image
						src={imagePreviewUrl}
						alt="Captured"
						width={imageDimensions?.width || 100}
						height={imageDimensions?.height || 100}
						className="object-cover w-full h-full"
					/>
				) : cameraError ? (
					<div className="flex items-center justify-center w-full h-full">
						<p className="text-sm text-gray-500">
							카메라를 사용할 수 없습니다.
						</p>
					</div>
				) : (
					<video
						ref={videoRef}
						autoPlay
						playsInline
						muted
						className="object-cover w-full h-full"
					/>
				)}
				{!isCaptured && !cameraError && (
					<button
						onClick={captureImage}
						className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-300"
					></button>
				)}
			</div>

			{isCaptured && (
				<div className="flex space-x-2 w-full px-4">
					<button
						onClick={confirmAndUploadImage}
						className="flex-1 px-6 py-2.5 bg-green-500 text-white rounded-2xl min-w-[90px]"
					>
						미션 완료
					</button>
					<button
						onClick={resetCapture}
						className="flex-1 px-6 py-2.5 bg-gray-500 text-white rounded-2xl min-w-[90px]"
					>
						다시 찍기
					</button>
				</div>
			)}

			<canvas ref={canvasRef} className="hidden"></canvas>

			{showToast && (
				<Toast message={showToast} onClose={() => setShowToast(null)} />
			)}
		</div>
	);
};

export default ShoppingCompleteModal;
