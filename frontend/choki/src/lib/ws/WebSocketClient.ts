import * as StompJs from '@stomp/stompjs';

class WebSocketClient {
	private client: StompJs.Client;
	private role: 'parent' | 'child';
	private subscriptionCallbacks: Map<
		string,
		(message: StompJs.Message) => void
	>;

	constructor(role: 'parent' | 'child') {
		this.role = role;
		this.subscriptionCallbacks = new Map();

		this.client = new StompJs.Client({
			brokerURL: 'wss://choki.co.kr/ws/shopping',
			reconnectDelay: 20000,
			debug: str => {
				console.log(str);
			},
			onConnect: () => {
				console.log(`${this.role} connected to WebSocket`);
				this.sendMessage('/app/check-connection', {
					message: 'Connected successfully',
					role: this.role,
				});
				// Execute all stored subscriptions
				this.subscriptionCallbacks.forEach((callback, topic) => {
					this.subscribeToTopic(topic, callback);
				});
			},
			onWebSocketError: error => {
				console.error(`${this.role} WebSocket Error:`, error);
			},
			onStompError: frame => {
				console.error(
					`${this.role} STOMP Error:`,
					frame.headers['message'],
					frame.body,
				);
			},
		});
	}

	private getAccessToken() {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('access');
		}
		return null;
	}

	isConnected(): boolean {
		return this.client.connected;
	}

	connect() {
		const token = this.getAccessToken() || '';
		if (token) {
			this.client.connectHeaders = { access: token };
			this.client.activate();
		} else {
			console.error('Access token not found');
		}
	}

	disconnect() {
		this.client.deactivate();
		this.subscriptionCallbacks.clear();
		console.log(`${this.role} disconnected from WebSocket`);
	}

	private subscribeToTopic(
		topic: string,
		callback: (message: StompJs.Message) => void,
	) {
		const token = this.getAccessToken() || '';
		this.client.subscribe(
			topic,
			message => {
				callback(message);
			},
			{ access: token },
		);
	}

	subscribe(topic: string, callback: (message: StompJs.Message) => void) {
		// Store the subscription
		this.subscriptionCallbacks.set(topic, callback);

		if (this.client.connected) {
			// If already connected, subscribe immediately
			this.subscribeToTopic(topic, callback);
		} else {
			// If not connected, connect first
			this.connect();
		}
	}

	sendMessage(destination: string, message: object) {
		if (this.client.connected) {
			this.client.publish({
				destination,
				body: JSON.stringify(message),
				headers: { access: this.getAccessToken() || '' },
			});
			console.log(`${this.role} sent message to ${destination}:`, message);
		} else {
			console.error(`${this.role} client not connected`);
			// Attempt to connect and send
			this.connect();
			// Wait for connection and retry
			setTimeout(() => {
				if (this.client.connected) {
					this.sendMessage(destination, message);
				}
			}, 1000);
		}
	}
}

const parentWebSocketClient = new WebSocketClient('parent');
const childWebSocketClient = new WebSocketClient('child');

export { parentWebSocketClient, childWebSocketClient };
