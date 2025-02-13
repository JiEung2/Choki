// ChildLocationSender.ts
import { useEffect } from 'react';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';

interface ChildLocationSenderProps {
	shoppingId: string;
}

const ChildLocationSender: React.FC<ChildLocationSenderProps> = ({
	shoppingId,
}) => {
	useEffect(() => {
		const sendLocation = () => {
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;
					const message = {
						shoppingId,
						latitude,
						longitude,
					};
					childWebSocketClient.sendMessage('/pub/shopping/point', message);
					console.log('Sent location:', message);
				},
				error => console.error('Failed to get current location:', error),
			);
		};

		const interval = setInterval(sendLocation, 5000);
		return () => clearInterval(interval);
	}, [shoppingId]);

	return null;
};

export default ChildLocationSender;
