import { useRouter } from 'next/router';
import Image from 'next/image';
// import previous_icon from '@/assets/icons/previous.svg';
import { MISSION_IMAGES } from '@/constants/mission';
// import { parentWebSocketClient } from '@/lib/ws/WebSocketClient';
import { useState, useEffect } from 'react';
import { getNotification } from '@/lib/api/parent';

export default function NotificationPage() {
	const [notificationList, setNotificationList] =
		useState<NotificationResponse[]>();
	const [childId, setChildId] = useState<number | null>(null);

	const router = useRouter();

	// 현재 선택한 아이 정보 가져오기 함수
	const getNotifications = async (childId: number) => {
		try {
			const notifications: NotificationResponse[] =
				await getNotification(childId);
			setNotificationList(notifications);
		} catch (error) {
			console.error('데이터를 가져오는 중 오류 발생:', error);
		}
	};

	const parseDateTime = (time: string) => {
		const date = new Date(time);

		// 년, 월, 일, 시, 분, 초 추출
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
		const day = date.getDate();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		// 원하는 포맷으로 출력 (예: YYYY-MM-DD HH:mm:ss)
		const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

		return formattedDate;
	};

	useEffect(() => {
		const url = new URL(window.location.href);
		const pathSegments = url.pathname.split('/');

		// 뒤에서 두 번째 숫자 가져오기
		const id = parseInt(pathSegments[pathSegments.length - 2] || '0');
		setChildId(id);
		console.log(id);
		getNotifications(id);
	}, []);

	const handleGoBack = () => {
		router.back();
	};

	const handleNotificationClick = (notification: NotificationResponse) => {
		if (notification.shoppingId && !notification.missionId) {
			// shoppingId 있고 missionId null일 때
			router.push(`/parents/${childId}/shop/${notification.shoppingId}/route`);
		} else if (notification.missionId && !notification.shoppingId) {
			// missionId 있고 shoppingId null일 때
			router.push(`/parents/${childId}/${notification.missionId}/accept`);
		}
	};

	// const subscribeWebSocket = (missionId: string) => {
	// 	parentWebSocketClient.connect();

	// 	parentWebSocketClient.subscribe(`/user/sub/shopping/${missionId}`, msg => {
	// 		console.log('받은 문자:', msg.body);
	// 		router.push(`/parents/shop/${missionId}/route`);
	// 	});
	// };

	return (
		<div className="flex flex-col w-full max-w-md mx-auto bg-light_yellow min-h-screen">
			<Image
				src="/icons/previous_nav.svg"
				alt="previous_icon"
				className="w-10 h-10 m-5 cursor-pointer rounded-2xl shadow-md"
				onClick={handleGoBack}
				width={48}
				height={48}
			/>

			{/* 알림목록 */}
			<div className="flex flex-col gap-4 p-4">
				{notificationList?.map(notification => (
					<div
						key={notification.missionId}
						className="flex items-center p-4 shadow-sm"
					>
						<div className="relative flex items-center justify-center min-w-[60px] min-h-[60px]">
							<Image
								src={MISSION_IMAGES[notification.type]}
								alt={notification.type}
								width={60}
								height={60}
								className="object-contain"
							/>
						</div>

						<div className="flex flex-col ml-4 flex-grow">
							<span className="text-base">{notification.content}</span>
							<span className="text-sm text-gray-400">
								{parseDateTime(notification.time)}
							</span>
						</div>
						<div className="min-w-[24px] min-h-[24px]">
							<Image
								src="/icons/right_arrow.svg"
								alt="detail"
								width={24}
								height={24}
								onClick={() => handleNotificationClick(notification)}
							/>
						</div>
					</div>
				))}
			</div>

			{/* 하단 네비게이션... */}
		</div>
	);
}
