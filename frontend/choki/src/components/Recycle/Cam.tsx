import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../Common/Button';
import { classifyRecycle, finishRecycle } from '@/lib/api/recycle';
import { useRouter } from 'next/router';

const Cam: React.FC<CamProps> = ({ onCaptureChange, completeFlag }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const router = useRouter();
	const { missionId } = router.query;

	// 후면 카메라 접근 함수
	const getRearCameraStream = async () => {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = devices.filter(
				device => device.kind === 'videoinput',
			);
			const rearCamera = videoDevices.find(
				device =>
					device.label.toLowerCase().includes('back') ||
					device.label.toLowerCase().includes('rear'),
			);

			if (rearCamera) {
				return await navigator.mediaDevices.getUserMedia({
					video: { deviceId: rearCamera.deviceId },
				});
			} else {
				return await navigator.mediaDevices.getUserMedia({
					video: { facingMode: { exact: 'environment' } },
				});
			}
		} catch (error) {
			console.error('후면 카메라 탐지 실패:', error);
			throw error;
		}
	};

	// 카메라 시작
	const startCamera = async () => {
		try {
			const stream = await getRearCameraStream();
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (error) {
			console.error('카메라 접근 실패:', error);
		}
	};

	const classify = async (image: File) => {
		try {
			const formData = new FormData();
			formData.append('image', image);

			const result = await classifyRecycle(formData);
			onCaptureChange(result.data);
			setCapturedImage(result.data.image.data);
		} catch (error) {
			console.error('분류 실패', error);
		}
	};

	const captureFinish = async (
		image: File,
		id: string | string[] | undefined,
	) => {
		try {
			const result = await finishRecycle(id, image);
			onCaptureChange(result);
		} catch (error) {
			console.error('분류 실패', error);
		}
	};

	useEffect(() => {
		startCamera();

		const currentVideoRef = videoRef.current;

		return () => {
			if (currentVideoRef && currentVideoRef.srcObject) {
				(currentVideoRef.srcObject as MediaStream)
					.getTracks()
					.forEach(track => track.stop());
			}
		};
	}, []);

	useEffect(() => {
		setCapturedImage(null);
		startCamera();
	}, [completeFlag]);

	const captureImage = () => {
		if (videoRef.current) {
			const canvas = document.createElement('canvas');
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

				canvas.toBlob(
					blob => {
						if (blob) {
							const file = new File([blob], 'captured-image.png', {
								type: 'image/png',
								lastModified: new Date().getTime(),
							});
							if (completeFlag) {
								captureFinish(file, missionId);
							} else {
								classify(file);
							}
						}
					},
					'image/png',
					0.9,
				);
			}
		}
	};

	const handleRetake = () => {
		setCapturedImage(null);
		startCamera();
		onCaptureChange(undefined);
	};

	return (
		<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg transform transition-transform mx-auto w-[80%] max-w-lg">
			<div className="mb-4 w-full flex justify-center">
				<div className="bg-gray-200 rounded-md shadow-md overflow-hidden w-80 h-80 flex items-center justify-center">
					{capturedImage ? (
						<Image
							src={capturedImage}
							alt="Captured"
							width={320}
							height={240}
							className="w-full h-full object-cover"
						/>
					) : (
						<video
							ref={videoRef}
							autoPlay
							className="w-full h-full object-cover"
						/>
					)}
				</div>
			</div>

			{capturedImage ? (
				<div className="flex gap-4 mt-4">
					<Button
						size="small"
						color="blue"
						onClick={handleRetake}
						text="알겠어!"
					/>
				</div>
			) : (
				<div onClick={captureImage} className="cursor-pointer mt-2">
					<Image
						src="/icons/camera_icon.svg"
						alt="Capture Image"
						width={50}
						height={50}
						className="hover:scale-110 transition-transform"
					/>
				</div>
			)}
		</div>
	);
};
export default Cam;
