import { useAtom } from 'jotai';
import { mapViewAtom } from '@/atoms/mapViewAtom';
import { useRouter } from 'next/router';
import StreetNavigationMap from './StreetNavigationMap';
import SatelliteGlobeMap from './SatelliteGlobeMap';
import mapboxgl from 'mapbox-gl';
import { useState } from 'react';

mapboxgl.accessToken =
	'pk.eyJ1IjoicGlpbGxsIiwiYSI6ImNtMnk1YTFsejBkcW0ycHM4a2lsNnNjbmcifQ.Iw08nUzhhZyUbZQNPoOu1A';

const MapContainer = () => {
	const router = useRouter();
	const { missionId } = router.query;
	const [mapViewState, setMapViewState] = useAtom(mapViewAtom);
	const [activeComponent, setActiveComponent] = useState<
		'Satellite' | 'Street'
	>(!mapViewState.hasInitialized ? 'Satellite' : 'Street');
	const [fade, setFade] = useState(false);

	const handleTransitionComplete = () => {
		setFade(true);

		setTimeout(() => {
			setMapViewState(prev => ({ ...prev, hasInitialized: true }));
			setActiveComponent('Street');
			setFade(false);
		}, 500);
	};

	return (
		<div className="relative w-full h-full">
			<div
				className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
					fade ? 'opacity-0' : 'opacity-100'
				}`}
			>
				{activeComponent === 'Satellite' && (
					<SatelliteGlobeMap onTransitionComplete={handleTransitionComplete} />
				)}
				{activeComponent === 'Street' && (
					<StreetNavigationMap missionId={missionId as string} />
				)}
			</div>
		</div>
	);
};

export default MapContainer;
