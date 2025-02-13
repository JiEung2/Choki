import { useEffect, useState } from 'react';
import MapContainer from './MapContainer';
import UserLocationMarker from './UserLocationMarker';
import RoutePolyline from './RoutePolyline';
import RouteRecorder from './RouteRecorder';
import SetDestination from './SetDestination';
import ChildNavBar from '../Common/Navbar/ChildNavBar';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getUsersNearby } from '@/lib/api/user';

const Map = ({
	coordinates,
	showRouteRecorder = true,
	showPolyline = true,
	showPreviousButton = true,
	showChildNavBar = false,
	route = [],
	showUsersAround = false,
}: MapProps) => {
	const [mapInstance, setMapInstance] = useState<any>(null);
	const [polyline, setPolyline] = useState<any>(null);
	const [startMarker, setStartMarker] = useState<any>(null);
	const [endMarker, setEndMarker] = useState<any>(null);
	const [finalRoute, setFinalRoute] = useState<
		{ latitude: number; longitude: number }[]
	>([]);
	const [showSetDestination, setShowSetDestination] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [nearbyUsers, setNearbyUsers] = useState<NearbyUserData | null>(null);
	const router = useRouter();

	// const { missionId } = router.query;

	useEffect(() => {
		if (showUsersAround) {
			const showNearbyUsers = async () => {
				try {
					const response = await getUsersNearby();
					setNearbyUsers(response);
					console.log('주변 아이 목록:', response);
				} catch (error) {
					console.error('주변 아이 정보 가져오는데 오류 발생:', error);
				}
			};

			showNearbyUsers();
		} else {
			setNearbyUsers(null);
		}
	}, [showUsersAround]);
	const handleRecordingFinished = () => {
		setShowSetDestination(true);
		setIsRecording(false);
	};

	const goToPreviousPage = () => {
		router.push('/parents');
	};

	const onClose = () => {
		setShowSetDestination(false);
	};

	return (
		<div style={{ height: '100vh', width: '100%', position: 'relative' }}>
			{mapInstance && showSetDestination && (
				<SetDestination onClose={onClose} route={finalRoute} />
			)}
			{showPreviousButton && (
				<button
					onClick={goToPreviousPage}
					style={{
						position: 'absolute',
						top: '15px',
						left: '15px',
						backgroundColor: '#e0e0e0',
						border: 'none',
						fontSize: '20px',
						cursor: 'pointer',
						borderRadius: '5px',
						padding: '10px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 5,
					}}
				>
					<Image src="/icons/back.png" alt="Back" width={7} height={7} />
				</button>
			)}
			<MapContainer onMapLoad={setMapInstance} />
			{mapInstance && (
				<UserLocationMarker
					map={mapInstance}
					coordinates={coordinates}
					nearbyUsers={nearbyUsers ?? undefined}
				/>
			)}
			{mapInstance && showPolyline && (
				<RoutePolyline
					map={mapInstance}
					route={route.length ? route : finalRoute}
					polyline={polyline}
					setPolyline={setPolyline}
					startMarker={startMarker}
					endMarker={endMarker}
					setStartMarker={setStartMarker}
					setEndMarker={setEndMarker}
				/>
			)}
			{showRouteRecorder && (
				<div
					style={{
						position: 'absolute',
						bottom: '10px',
						left: '50%',
						transform: 'translateX(-50%)',
						zIndex: 11,
						padding: '10px',
						borderRadius: '5px',
					}}
				>
					<RouteRecorder
						map={mapInstance}
						setFinalRoute={setFinalRoute}
						onRecordingFinish={handleRecordingFinished}
						isRecording={isRecording}
						setIsRecording={setIsRecording}
					/>
				</div>
			)}
			{showChildNavBar && (
				<div
					style={{
						position: 'absolute',
						bottom: '0',
						width: '100%',
						zIndex: 10,
					}}
				>
					<ChildNavBar />
				</div>
			)}
			{isRecording && (
				<div className="fixed inset-0 flex items-center justify-center z-10">
					<div className="absolute inset-0 pointer-events-none"></div>
					<div
						className="relative bg-white rounded-lg shadow-lg p-6 max-w-xs w-full flex flex-col items-center"
						style={{
							animation: 'blink 2s infinite ease-in-out',
							transform: 'translateY(-170px)',
						}}
					>
						<h3 className="text-lg font-semibold mb-2">경로 기록중...</h3>
					</div>
					{/* 반짝이는 효과 */}
					<style jsx>{`
						@keyframes blink {
							0%,
							100% {
								opacity: 1;
							}
							50% {
								opacity: 0;
							}
						}
					`}</style>
				</div>
			)}
		</div>
	);
};

export default Map;
