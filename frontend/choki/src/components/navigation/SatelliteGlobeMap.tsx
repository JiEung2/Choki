import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import mapboxgl from 'mapbox-gl';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { mapViewAtom } from '@/atoms/mapViewAtom';
import 'mapbox-gl/dist/mapbox-gl.css';
import SkyLayer from './SkyLayer';
import ThreeDBuildingsLayer from './3DBuildingsLayer';
import MapStyles from './MapStyles';

interface SatelliteGlobeMapProps {
	onTransitionComplete: () => void;
}

const SatelliteGlobeMap: React.FC<SatelliteGlobeMapProps> = ({
	onTransitionComplete,
}) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<mapboxgl.Map | null>(null);
	const [mapViewState, setMapViewState] = useAtom(mapViewAtom);
	const router = useRouter();
	const [showButtons, setShowButtons] = useState(true);

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

		mapContainerRef.current.innerHTML = '';

		const mapInstance = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/satellite-v9',
			center: [0, 20],
			zoom: 1.5,
			projection: 'globe',
			attributionControl: false,
		});

		mapInstance.on('style.load', () => {
			mapInstance.setFog({
				color: 'rgb(186, 210, 235)',
				'high-color': 'rgb(36, 92, 223)',
				'horizon-blend': 0.02,
				'space-color': 'rgb(11, 11, 25)',
				'star-intensity': 0.6,
			});
			applyKoreanLabels(mapInstance);
			setMap(mapInstance);
		});

		return () => {
			mapInstance.remove();
		};
	}, []);

	useEffect(() => {
		if (!map) return;

		navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords;
				setMapViewState(prev => ({
					...prev,
					userLocation: [longitude, latitude],
				}));
			},
			error => {
				console.error('Error getting current position:', error);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);
	}, [map, setMapViewState]);

	const handleTransition = () => {
		if (!map || !mapViewState.userLocation) return;

		setMapViewState(prev => ({ ...prev, isTransitioning: true }));
		setShowButtons(false);

		map.flyTo({
			center: mapViewState.userLocation,
			zoom: 3,
			duration: 2000,
			pitch: 0,
			bearing: 0,
		});

		setTimeout(() => {
			map.setProjection({ name: 'mercator' });
			map.setStyle('mapbox://styles/mapbox/streets-v11');

			map.once('style.load', () => {
				applyKoreanLabels(map);
				SkyLayer(map);
				ThreeDBuildingsLayer(map);
				MapStyles(map);

				map.flyTo({
					center: mapViewState.userLocation!,
					zoom: 18,
					pitch: 75,
					duration: 3000,
					essential: true,
				});

				setTimeout(() => {
					setMapViewState(prev => ({
						...prev,
						hasInitialized: true,
						isTransitioning: false,
					}));
					onTransitionComplete();
				}, 3000);
			});
		}, 2500);
	};

	const goBack = () => {
		router.push('/child/main');
	};

	return (
		<div className="relative w-full h-screen">
			<style>{`
    .mapboxgl-ctrl-bottom-left { display: none !important; }
		.mapboxgl-map {
			opacity: 1;
			transition: opacity 0.3s ease-in;
  	}
		.mapboxgl-map.loading {
			opacity: 0;
		}
  `}</style>
			<div
				ref={mapContainerRef}
				className={`w-full h-full ${!map ? 'loading' : ''}`}
			/>{' '}
			{showButtons && (
				<>
					<button
						onClick={goBack}
						className="absolute top-4 left-4 px-4 py-2 bg-white rounded-lg shadow-lg text-lg font-semibold transition-all duration-300"
					>
						돌아가기
					</button>
					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
           pl-4 pr-5 py-3 rounded-full shadow-lg 
           text-white text-lg font-semibold
           transition-all duration-300 inline-flex items-center gap-3
           hover:opacity-90 active:opacity-80"
						style={{
							background: 'linear-gradient(180deg, #6360F5 0%, #9896FF 100%)',
						}}
						onClick={handleTransition}
					>
						{mapViewState.userLocation ? (
							<>
								<Image
									src="/icons/basket_icon.svg"
									alt="shopping icon"
									width={40}
									height={40}
								/>
								장보러 가기
							</>
						) : (
							'위치 확인 중...'
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default SatelliteGlobeMap;
