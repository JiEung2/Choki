import Map from '@/components/map/Map';
import { parentWebSocketClient } from '@/lib/ws/WebSocketClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ParentsShoppingNavbar from '@/components/Common/Navbar/ParentsShoppingNavbar';
import OffRouteModal from '@/components/map/OffRouteModal';
import { getKidDataFromParent } from '@/lib/api/parent';
import CallConfirmModal from '@/components/map/CallConfirmModal';

export default function ChildIsShoppingPage() {
	const [route, setRoute] = useState<
		{ latitude: number; longitude: number }[] | undefined
	>(undefined);
	const [currentLocation, setCurrentLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [showOffRouteModal, setShowOffRouteModal] = useState(false);
	const [showPhoneConfirm, setShowPhoneConfirm] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState('');

	const router = useRouter();
	const { childId, missionId } = router.query;

	const handleCallChild = async () => {
		try {
			const kidData = await getKidDataFromParent(Number(childId));
			if (kidData.tel) {
				setPhoneNumber(kidData.tel);
				setShowPhoneConfirm(true);
			} else {
				console.log('전화번호를 찾을 수 없습니다.');
			}
		} catch (error) {
			console.error('아이 정보를 가져오는데 실패했습니다:', error);
		}
	};

	const handleConfirmCall = () => {
		window.location.href = `tel:${phoneNumber}`;
		setShowPhoneConfirm(false);
		setShowOffRouteModal(false);
	};

	const handleCancelCall = () => {
		setShowPhoneConfirm(false);
	};

	useEffect(() => {
		parentWebSocketClient.connect();

		parentWebSocketClient.subscribe(`/user/sub/shopping/${missionId}`, msg => {
			console.log('Received message:', msg.body);
			const data = JSON.parse(msg.body);

			if (data.route) {
				setRoute(data.route);
			} else if (data.type === 'POINT' && data.latitude && data.longitude) {
				setCurrentLocation({
					latitude: data.latitude,
					longitude: data.longitude,
				});
			} else if (data.type === 'DANGER') {
				console.log('경로 이탈 메시지 수신');
				setShowOffRouteModal(true);
			}
		});

		return () => {
			parentWebSocketClient.disconnect();
		};
	}, [missionId]);

	return (
		<div className="relative min-h-screen bg-light_yellow flex flex-col items-center justify-center pb-24">
			<ParentsShoppingNavbar
				childId={childId as string}
				missionId={missionId as string}
			/>
			<div
				className="w-full max-w-3xl overflow-hidden shadow-lg rounded-lg p-2"
				style={{
					height: '750px',
					position: 'relative',
					marginTop: '120px',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '100%',
						height: '850px',
					}}
				>
					<Map
						showPolyline={true}
						showPreviousButton={false}
						showRouteRecorder={false}
						showChildNavBar={false}
						route={route}
						coordinates={currentLocation}
						showUsersAround={false}
					/>
				</div>
			</div>

			{showOffRouteModal && (
				<OffRouteModal
					onClose={() => setShowOffRouteModal(false)}
					onCallChild={handleCallChild}
				/>
			)}

			{showPhoneConfirm && (
				<CallConfirmModal
					phoneNumber={phoneNumber}
					onConfirm={handleConfirmCall}
					onCancel={handleCancelCall}
				/>
			)}
		</div>
	);
}
