// OffRouteWarning.ts
import { useEffect } from 'react';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';

interface OffRouteWarningProps {
	isOffRoute: boolean;
	shoppingId: string;
}

const OffRouteWarning: React.FC<OffRouteWarningProps> = ({
	isOffRoute,
	shoppingId,
}) => {
	// useEffect(() => {
	// 	if (!shoppingId) return;

	// 	childWebSocketClient.connect();

	// 	return () => {
	// 		childWebSocketClient.disconnect();
	// 	};
	// }, [shoppingId]);

	useEffect(() => {
		if (isOffRoute && childWebSocketClient.isConnected()) {
			const message = { message: '경로를 이탈했어요', shoppingId: shoppingId };
			childWebSocketClient.sendMessage('/pub/shopping/point/danger', message);
			console.log('경로 이탈 메시지:', message);
		}
	}, [isOffRoute, shoppingId]);

	return null;
};

export default OffRouteWarning;
