import { useCallback, useRef } from 'react';
import SkyLayer from './SkyLayer';
import ThreeDBuildingsLayer from './3DBuildingsLayer';
import MapStyles from './MapStyles';
import Image from 'next/image';

interface TransitionToLocalViewProps {
	map: mapboxgl.Map | null;
	userLocation: [number, number] | null;
	setIsGlobeView: (value: boolean) => void;
	route: { latitude: number; longitude: number }[] | null;
}

const TransitionToLocalView: React.FC<TransitionToLocalViewProps> = ({
	map,
	userLocation,
	setIsGlobeView,
	route,
}) => {
	const stepRef = useRef(0);

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

	const transitionToLocalView = useCallback(() => {
		if (!map || !userLocation || !route) return;

		{
			setIsGlobeView(false);

			map.flyTo({
				center: userLocation,
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

					map.flyTo({
						center: userLocation,
						zoom: 18,
						pitch: 75,
						duration: 3000,
						essential: true,
					});

					const geojson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
						type: 'FeatureCollection',
						features: [
							{
								type: 'Feature',
								properties: {},
								geometry: {
									type: 'LineString',
									coordinates: route.map(point => [
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
					}

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

					SkyLayer(map);
					ThreeDBuildingsLayer(map);
					MapStyles(map);
				});
			}, 2500);
		}
	}, [map, userLocation, setIsGlobeView, route, animateDashArray]);

	return (
		<div
			className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             pl-4 pr-5 py-3 rounded-full shadow-lg 
             text-white text-lg font-semibold
             transition-all duration-300 inline-flex items-center gap-3
             hover:opacity-90 active:opacity-80"
			style={{
				background: 'linear-gradient(180deg, #6360F5 0%, #9896FF 100%)',
			}}
			onClick={transitionToLocalView}
		>
			{userLocation ? (
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
	);
};

export default TransitionToLocalView;
