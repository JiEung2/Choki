import { useState, useEffect } from 'react';
import Image from 'next/image';

const RouteRecorder = ({
	map,
	setFinalRoute,
	onRecordingFinish,
	isRecording,
	setIsRecording,
}: RouteRecorderProps) => {
	const [watchId, setWatchId] = useState<number | null>(null);
	const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>(
		[],
	);
	const [polyline, setPolyline] = useState<any | null>(null);

	const startRecording = () => {
		if (isRecording) return;
		setIsRecording(true);
		console.log('기록 시작');
		setRoute([]);

		const id = navigator.geolocation.watchPosition(
			position => {
				const { latitude, longitude } = position.coords;
				if (
					latitude >= 33.0 &&
					latitude <= 38.6 &&
					longitude >= 124.6 &&
					longitude <= 131.9
				) {
					console.log(`위도: ${latitude}, 경도: ${longitude}`);
					const newPoint = { latitude, longitude };

					setRoute(prevRoute => {
						const updatedRoute = [...prevRoute, newPoint];
						drawRoute(updatedRoute);
						return updatedRoute;
					});
				} else {
					console.warn('이상한 좌표 감지');
				}
			},
			error => {
				console.error('위치 가져오는 중 오류 발생:', error);
			},
			{ enableHighAccuracy: true },
		);

		setWatchId(id);
	};

	const stopRecording = () => {
		if (!isRecording) return;
		if (watchId !== null) {
			navigator.geolocation.clearWatch(watchId);
			setWatchId(null);
		}
		setIsRecording(false);

		console.log('최종 경로:', route);
		setFinalRoute(route);
		onRecordingFinish();
	};

	const drawRoute = (
		currentRoute: { latitude: number; longitude: number }[],
	) => {
		const kakao = (window as any).kakao;

		if (!map || !currentRoute.length) return;

		// Remove existing polyline if any
		if (polyline) {
			polyline.setMap(null);
		}

		// Map route points to Kakao's LatLng objects
		const path = currentRoute.map(
			point => new kakao.maps.LatLng(point.latitude, point.longitude),
		);

		// Create a new polyline and add it to the map
		const newPolyline = new kakao.maps.Polyline({
			path: path,
			strokeWeight: 5,
			strokeColor: '#FF0000',
			strokeOpacity: 0.7,
			strokeStyle: 'solid',
		});

		newPolyline.setMap(map);
		setPolyline(newPolyline);
	};

	useEffect(() => {
		return () => {
			if (watchId !== null) navigator.geolocation.clearWatch(watchId);
		};
	}, [watchId]);

	return (
		<div style={{ display: 'flex', gap: '40px' }}>
			<div
				onClick={startRecording}
				style={{
					cursor: isRecording ? 'not-allowed' : 'pointer',
					opacity: isRecording ? 0.5 : 1,
					background: 'transparent',
					border: 'none',
					padding: 0,
				}}
			>
				<Image
					src="/icons/start_btn.svg"
					alt="Start Recording"
					width={70}
					height={70}
					priority
				/>
			</div>
			<div
				onClick={stopRecording}
				style={{
					cursor: !isRecording ? 'not-allowed' : 'pointer',
					opacity: !isRecording ? 0.5 : 1,
					background: 'transparent',
					border: 'none',
					padding: 0,
				}}
			>
				<Image
					src="/icons/finish_btn.svg"
					alt="Stop Recording"
					width={70}
					height={70}
				/>
			</div>
		</div>
	);
};

export default RouteRecorder;
