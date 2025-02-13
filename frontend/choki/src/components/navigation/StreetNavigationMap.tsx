import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAtom } from 'jotai';
import { mapViewAtom } from '@/atoms/mapViewAtom';
import { shoppingListAtom } from '@/atoms/shoppingAtom';
import UpperNavbar from '../Common/Navbar/WhiteUpperNavbar';
import CurrentLocationButton from './CurrentLocationButton';
import TimeDistanceTracker from './TimeDistanceTracker';
import ChildLocationSender from '@/lib/ws/ChildLocationSender';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';
import ShoppingCompleteModal from '../Common/Modal/ShoppingCompleteModal';
import Image from 'next/image';
import SkyLayer from './SkyLayer';
import ThreeDBuildingsLayer from './3DBuildingsLayer';
import MapStyles from './MapStyles';
import 'mapbox-gl/dist/mapbox-gl.css';

interface StreetNavigationMapProps {
	missionId: string;
}

const StreetNavigationMap: React.FC<StreetNavigationMapProps> = ({
	missionId,
}) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<mapboxgl.Map | null>(null);
	const [mapViewState] = useAtom(mapViewAtom);
	const [originalRoute, setOriginalRoute] = useState<
		{ latitude: number; longitude: number }[] | null
	>(null);
	const [currentRoute, setCurrentRoute] = useState<
		{ latitude: number; longitude: number }[] | null
	>(null);
	const [destination, setDestination] = useState<'Mart' | 'Home'>('Mart');
	const [isMissionFinishModalOpen, setIsMissionFinishModalOpen] =
		useState(false);
	const [, setShoppingList] = useAtom(shoppingListAtom);
	const stepRef = useRef(0);
	const [, setCurrentLocation] = useState<[number, number] | null>(null);
	const [showRedFlash, setShowRedFlash] = useState(false);
	const flashIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const startFlashing = useCallback(() => {
		if (!flashIntervalRef.current) {
			flashIntervalRef.current = setInterval(() => {
				setShowRedFlash(prev => !prev);
			}, 500);
		}
	}, []);

	const stopFlashing = useCallback(() => {
		if (flashIntervalRef.current) {
			clearInterval(flashIntervalRef.current);
			flashIntervalRef.current = null;
			setShowRedFlash(false);
		}
	}, []);

	useEffect(() => {
		return () => stopFlashing();
	}, [stopFlashing]);

	const applyKoreanLabels = (mapInstance: mapboxgl.Map) => {
		const style = mapInstance.getStyle();
		if (style && style.layers) {
			style.layers.forEach(layer => {
				if (
					layer.type === 'symbol' &&
					layer.layout &&
					'text-field' in layer.layout
				) {
					mapInstance.setLayoutProperty(layer.id, 'text-field', [
						'coalesce',
						['get', 'name_ko'],
						['get', 'name'],
					]);
				}
			});
		}
	};

	useEffect(() => {
		if (!mapContainerRef.current) return;

		const mapInstance = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: mapViewState.userLocation || [0, 0],
			zoom: 18,
			pitch: 60,
			projection: 'mercator',
			attributionControl: false,
		});

		mapInstance.on('style.load', () => {
			applyKoreanLabels(mapInstance);
			SkyLayer(mapInstance);
			ThreeDBuildingsLayer(mapInstance);
			MapStyles(mapInstance);

			if (mapViewState.userLocation) {
				mapInstance.flyTo({
					center: mapViewState.userLocation,
					zoom: 18,
					pitch: 75,
					duration: 0,
				});
			}

			setMap(mapInstance);
		});

		return () => {
			mapInstance.remove();
		};
	}, [mapViewState.userLocation]);

	useEffect(() => {
		if (!missionId) return;

		childWebSocketClient.connect();

		childWebSocketClient.subscribe(`/user/sub/shopping/${missionId}`, msg => {
			const data = JSON.parse(msg.body);
			setShoppingList(data.shoppingList);
			setOriginalRoute(data.route);
			setCurrentRoute(data.route);
		});

		return () => {
			childWebSocketClient.disconnect();
		};
	}, [missionId, setShoppingList]);

	const toggleDestination = () => {
		if (destination === 'Mart') {
			setCurrentRoute(originalRoute ? [...originalRoute].reverse() : null);
			setDestination('Home');
		} else {
			setCurrentRoute(originalRoute);
			setDestination('Mart');
		}
	};

	const animateDashArray = useCallback(
		(timestamp: number) => {
			if (!map || !map.isStyleLoaded() || !map.getLayer('line-dashed')) return;

			const dashArraySequence = [
				[0, 4, 3],
				[0.5, 4, 2.5],
				[1, 4, 2],
				[1.5, 4, 1.5],
				[2, 4, 1],
				[2.5, 4, 0.5],
				[3, 4, 0],
				[0, 0.5, 3, 3.5],
				[0, 1, 3, 3],
				[0, 1.5, 3, 2.5],
				[0, 2, 3, 2],
				[0, 2.5, 3, 1.5],
				[0, 3, 3, 1],
				[0, 3.5, 3, 0.5],
			];
			const newStep = Math.floor((timestamp / 50) % dashArraySequence.length);

			if (newStep !== stepRef.current) {
				map.setPaintProperty(
					'line-dashed',
					'line-dasharray',
					dashArraySequence[newStep] as number[],
				);
				stepRef.current = newStep;
			}

			requestAnimationFrame(animateDashArray);
		},
		[map],
	);

	useEffect(() => {
		if (!map || !currentRoute) return;
		console.log('Drawing route:', currentRoute);

		const geojson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: currentRoute.map(point => [
							point.longitude,
							point.latitude,
						]),
					},
				},
			],
		};

		if (!map.getSource('line')) {
			map.addSource('line', {
				type: 'geojson',
				data: geojson,
			});

			map.addLayer({
				id: 'line-background',
				type: 'line',
				source: 'line',
				paint: {
					'line-color': 'orange',
					'line-width': 6,
					'line-opacity': 0.4,
				},
			});

			map.addLayer({
				id: 'line-dashed',
				type: 'line',
				source: 'line',
				paint: {
					'line-color': 'orange',
					'line-width': 6,
					'line-dasharray': [0, 4, 3],
				},
			});

			animateDashArray(0);
		}
	}, [map, currentRoute, animateDashArray]);

	useEffect(() => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;
					setCurrentLocation([longitude, latitude]);

					if (map) {
						map.flyTo({
							center: [longitude, latitude],
							zoom: 18,
							pitch: 60,
							duration: 1000,
						});
					}
				},
				error => {
					console.error('Error getting current location:', error);
				},
				{ enableHighAccuracy: true },
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
		}
	}, [map]);

	return (
		<div className="relative w-full h-screen">
			<style>{`.mapboxgl-ctrl-logo { display: none !important; }`}</style>
			<div
				className={`absolute inset-0 bg-red-500 z-50 transition-opacity ${
					showRedFlash ? 'opacity-60' : 'opacity-0'
				}`}
				style={{ pointerEvents: 'none' }}
			/>
			<div ref={mapContainerRef} className="w-full h-full" />
			{missionId && <ChildLocationSender shoppingId={missionId} />}

			<UpperNavbar missionId={missionId} />
			<CurrentLocationButton map={map} />
			<TimeDistanceTracker
				route={currentRoute ?? []}
				userLocation={mapViewState.userLocation}
				shoppingId={missionId}
				onOffRouteChange={isOffRoute => {
					if (isOffRoute) {
						startFlashing();
					} else {
						stopFlashing();
					}
				}}
			/>

			{destination === 'Home' && (
				<button
					onClick={() => setIsMissionFinishModalOpen(true)}
					className="absolute top-1/2 -translate-y-[90%] right-4 bg-green-500 text-white px-3 py-3 rounded-2xl shadow-lg z-10"
				>
					완료
				</button>
			)}

			<div className="absolute top-1/3 right-4 transform -translate-y-1/2 z-20">
				<label className="relative inline-flex flex-col items-center cursor-pointer">
					<input
						type="checkbox"
						className="sr-only peer"
						checked={destination === 'Home'}
						onChange={toggleDestination}
					/>
					<div className="h-36 w-12 bg-white peer-focus:outline-none peer-focus:ring-2 rounded-full peer dark:bg-gray-700 relative">
						<span
							className={`absolute flex flex-col items-center justify-center top-1 left-1 w-10 h-20 bg-gray-300 rounded-full transition-transform ${
								destination === 'Home' ? 'translate-y-14' : ''
							}`}
						>
							{destination === 'Mart' ? (
								<Image
									src="/icons/map_shop_icon.svg"
									alt="Mart Icon"
									width={30}
									height={30}
								/>
							) : (
								<Image
									src="/icons/home_nav.svg"
									alt="Home Icon"
									width={30}
									height={30}
								/>
							)}
						</span>
					</div>
				</label>
			</div>

			{isMissionFinishModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="relative">
						<ShoppingCompleteModal missionId={missionId} />
						<button
							onClick={() => setIsMissionFinishModalOpen(false)}
							className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full"
						>
							X
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default StreetNavigationMap;
