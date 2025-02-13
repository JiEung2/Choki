import mapboxgl from 'mapbox-gl';

const ThreeDBuildingsLayer = (map: mapboxgl.Map) => {
	map.addLayer({
		id: '3d-buildings',
		source: 'composite',
		'source-layer': 'building',
		type: 'fill-extrusion',
		minzoom: 15,
		paint: {
			'fill-extrusion-color': [
				'interpolate',
				['linear'],
				['get', 'height'],
				0,
				'#f8f4f0',
				150,
				'#ff5c33',
			],
			'fill-extrusion-height': [
				'interpolate',
				['linear'],
				['get', 'height'],
				0,
				0,
				150,
				150,
			],
			'fill-extrusion-base': [
				'interpolate',
				['linear'],
				['get', 'min_height'],
				0,
				0,
				150,
				150,
			],
			'fill-extrusion-opacity': 0.8,
		},
	});
};

export default ThreeDBuildingsLayer;
