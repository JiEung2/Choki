import { atom } from 'jotai';

interface MapViewState {
	hasInitialized: boolean;
	isTransitioning: boolean;
	userLocation: [number, number] | null;
}

export const mapViewAtom = atom<MapViewState>({
	hasInitialized: false,
	isTransitioning: false,
	userLocation: null,
});
