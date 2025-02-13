import mapboxgl from 'mapbox-gl';

const MapStyles = (map: mapboxgl.Map) => {
	map.setPaintProperty('land', 'background-color', '#C3DAB0');

	const roadLayers = [
		'road-primary',
		'road-secondary-tertiary',
		'road-motorway-trunk',
		'road-street',
		'road-minor',
		'road-path',
		'road-steps',
		'road-pedestrian',
		'road-construction',
		'bridge-street-minor',
		'bridge-primary-secondary-tertiary',
		'bridge-motorway-trunk',
		'bridge-path',
		'bridge-pedestrian',
	];

	roadLayers.forEach(layer => {
		map.setPaintProperty(layer, 'line-color', '#FFFFFF');
	});
};

export default MapStyles;
