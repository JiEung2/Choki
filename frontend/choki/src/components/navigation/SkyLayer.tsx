import mapboxgl from 'mapbox-gl';

const SkyLayer = (map: mapboxgl.Map) => {
	map.addLayer({
		id: 'sky',
		type: 'sky',
		paint: {
			'sky-type': 'atmosphere',
			'sky-atmosphere-sun': [0.0, 0.0],
			'sky-atmosphere-sun-intensity': 15,
			'sky-atmosphere-color': '#4682B4',
		},
	});
};

export default SkyLayer;
