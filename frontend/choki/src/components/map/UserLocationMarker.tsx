import { useEffect, useRef } from 'react';

interface NearbyUserData {
	latitude: number;
	longitude: number;
	animalImage: string;
	users: Array<{
		userId: number;
		username: string;
		latitude: number;
		longitude: number;
		animalId: number;
		animalImage: string;
	}>;
}

interface UserLocationMarkerProps {
	map: any;
	coordinates?: { latitude: number; longitude: number } | null;
	nearbyUsers?: NearbyUserData | null;
}

const UserLocationMarker = ({
	map,
	coordinates,
	nearbyUsers,
}: UserLocationMarkerProps) => {
	const mainMarkerRef = useRef<any>(null);
	const customOverlaysRef = useRef<any[]>([]);

	useEffect(() => {
		if (!map || !navigator.geolocation) {
			console.error('위치 및 지도 오류');
			return;
		}

		const kakao = (window as any).kakao;

		const cleanup = () => {
			if (mainMarkerRef.current) {
				mainMarkerRef.current.setMap(null);
			}
			customOverlaysRef.current.forEach(overlay => overlay.setMap(null));
			customOverlaysRef.current = [];
		};

		// Create main character marker
		const defaultMarkerImage = new kakao.maps.MarkerImage(
			'/icons/dog_character.svg',
			new kakao.maps.Size(60, 60),
			{ offset: new kakao.maps.Point(30, 60) },
		);

		const mainMarker = new kakao.maps.Marker({
			image: defaultMarkerImage,
			map,
		});
		mainMarkerRef.current = mainMarker;

		const createSpeechBubble = (position: any, imageUrl: string) => {
			const content = document.createElement('div');
			content.className = 'relative';
			content.innerHTML = `
        <div style="
          width: 50px;
          height: 50px;
          background-image: url('/icons/speech_bubble.svg');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 8px;
        ">
          <img 
            src="${imageUrl}" 
            alt="Animal" 
            style="
              width: 30px;
              height: 30px;
              display: block;
              object-fit: contain;
            "
          />
        </div>
      `;

			return new kakao.maps.CustomOverlay({
				position: position,
				content: content,
				yAnchor: 1.2,
				zIndex: 1,
			});
		};

		const updateMarkerPosition = (latitude: number, longitude: number) => {
			const location = new kakao.maps.LatLng(latitude, longitude);
			mainMarker.setPosition(location);
			map.setCenter(location);
		};

		if (nearbyUsers) {
			// Update main marker with user's animal
			const animalMarkerImage = new kakao.maps.MarkerImage(
				nearbyUsers.animalImage,
				new kakao.maps.Size(50, 50),
				{ offset: new kakao.maps.Point(30, 60) },
			);
			mainMarker.setImage(animalMarkerImage);

			// Set main marker position
			updateMarkerPosition(nearbyUsers.latitude, nearbyUsers.longitude);

			// Create speech bubbles for nearby users only
			nearbyUsers.users.forEach(user => {
				const userLocation = new kakao.maps.LatLng(
					user.latitude,
					user.longitude,
				);

				const speechBubble = createSpeechBubble(userLocation, user.animalImage);
				speechBubble.setMap(map);
				customOverlaysRef.current.push(speechBubble);
			});
		} else if (coordinates) {
			console.log('웹소켓 좌표 위치 사용:', coordinates);
			updateMarkerPosition(coordinates.latitude, coordinates.longitude);
		} else {
			const watchId = navigator.geolocation.watchPosition(
				position => {
					const { latitude, longitude } = position.coords;
					console.log('현재 위치 사용:', latitude, longitude);
					updateMarkerPosition(latitude, longitude);
				},
				error => {
					console.error('현재 위치 가져오는 중 오류:', error);
				},
				{ enableHighAccuracy: true },
			);

			return () => {
				navigator.geolocation.clearWatch(watchId);
				cleanup();
			};
		}

		return cleanup;
	}, [map, coordinates, nearbyUsers]);

	return null;
};

export default UserLocationMarker;
