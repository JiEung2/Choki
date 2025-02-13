import { FC, useEffect, useState, useCallback, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface CenterButtonProps {
	map: mapboxgl.Map | null;
}

const CurrentLocationButton: FC<CenterButtonProps> = ({ map }) => {
	const [currentLocation, setCurrentLocation] = useState<
		[number, number] | null
	>(null);
	const [deviceDirection, setDeviceDirection] = useState<number>(0);
	const [permissionsGranted, setPermissionsGranted] = useState(false);
	const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
	const cleanupRef = useRef(false);

	const handleDeviceOrientation = useCallback(
		(event: DeviceOrientationEvent) => {
			const webkitCompassHeading = (event as any).webkitCompassHeading;
			let compassHeading = 0;

			if (webkitCompassHeading !== undefined) {
				compassHeading = webkitCompassHeading;
			} else if (event.alpha !== null) {
				compassHeading = (360 - event.alpha + 360) % 360;
			}

			setDeviceDirection(compassHeading);
		},
		[],
	);

	const requestPermissions = useCallback(async () => {
		// Request device orientation permission
		if (
			typeof DeviceOrientationEvent !== 'undefined' &&
			typeof (DeviceOrientationEvent as any).requestPermission === 'function'
		) {
			try {
				const orientationPermission = await (
					DeviceOrientationEvent as any
				).requestPermission();
				if (orientationPermission === 'granted') {
					window.addEventListener(
						'deviceorientation',
						handleDeviceOrientation,
						true,
					);
				}
			} catch (error) {
				console.error('Error requesting orientation permission:', error);
			}
		}

		// Request geolocation permission
		if ('geolocation' in navigator) {
			try {
				await new Promise((resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject, {
						enableHighAccuracy: true,
						timeout: 5000,
						maximumAge: 0,
					});
				});
			} catch (error) {
				console.error('Error requesting geolocation permission:', error);
			}
		}

		setPermissionsGranted(true);
	}, [handleDeviceOrientation]);

	useEffect(() => {
		if (!map || cleanupRef.current || !permissionsGranted) return;

		if (!geolocateControlRef.current) {
			const geolocateControl = new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
				showUserHeading: true,
				showAccuracyCircle: false,
			});

			geolocateControlRef.current = geolocateControl;
			map.addControl(geolocateControl);

			geolocateControl.on('geolocate', (position: GeolocationPosition) => {
				const { longitude, latitude } = position.coords;
				setCurrentLocation([longitude, latitude]);
			});

			setTimeout(() => {
				geolocateControl.trigger();
			}, 1000);
		}

		return () => {
			if (!cleanupRef.current && geolocateControlRef.current && map) {
				cleanupRef.current = true;
				try {
					map.removeControl(geolocateControlRef.current);
				} catch (error) {
					console.warn('Error removing geolocate control:', error);
				}
				geolocateControlRef.current = null;
				window.removeEventListener(
					'deviceorientation',
					handleDeviceOrientation,
					true,
				);
			}
		};
	}, [map, handleDeviceOrientation, permissionsGranted]);

	const centerMapOnLocation = useCallback(() => {
		if (map && currentLocation) {
			map.flyTo({
				center: currentLocation,
				zoom: 18,
				pitch: 60,
				bearing: deviceDirection,
				duration: 1000,
			});
		}
	}, [map, currentLocation, deviceDirection]);

	if (!permissionsGranted) {
		return (
			<button
				onClick={requestPermissions}
				className="absolute bottom-40 right-4 bg-white border-none p-2.5 cursor-pointer rounded-lg shadow-md z-10 flex items-center justify-center"
			>
				위치 및 나침반 권한 요청
			</button>
		);
	}

	return (
		<button
			onClick={centerMapOnLocation}
			className="absolute bottom-40 right-4 bg-white border-none p-2.5 cursor-pointer rounded-lg shadow-md z-10 flex items-center justify-center"
			disabled={!currentLocation}
		>
			현재 위치로
		</button>
	);
};

export default CurrentLocationButton;
