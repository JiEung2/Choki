import { useEffect } from 'react';

const RoutePolyline: React.FC<RoutePolylineProps> = ({
	map,
	route,
	polyline,
	setPolyline,
	startMarker,
	endMarker,
	setStartMarker,
	setEndMarker,
}) => {
	useEffect(() => {
		if (!map || !route || route.length === 0) return;

		// Clear any existing polyline
		if (polyline) {
			polyline.setMap(null);
		}
		if (startMarker) {
			startMarker.setMap(null);
		}
		if (endMarker) {
			endMarker.setMap(null);
		}

		// Convert route to Kakao Map LatLng points
		const linePath = route.map(
			point => new kakao.maps.LatLng(point.latitude, point.longitude),
		);

		// Draw the polyline on the map
		const newPolyline = new kakao.maps.Polyline({
			path: linePath,
			strokeWeight: 5,
			strokeColor: '#FF0000',
			strokeOpacity: 0.7,
			strokeStyle: 'solid',
		});
		newPolyline.setMap(map);
		setPolyline(newPolyline);

		const startMarkerImage = new kakao.maps.MarkerImage(
			'/icons/map_home_icon.svg',
			new kakao.maps.Size(40, 40),
			{ offset: new kakao.maps.Point(20, 40) },
		);
		const endMarkerImage = new kakao.maps.MarkerImage(
			'/icons/map_shop_icon.svg',
			new kakao.maps.Size(40, 40),
			{ offset: new kakao.maps.Point(20, 40) },
		);

		// Create and place start marker
		const start = new kakao.maps.Marker({
			position: linePath[0],
			image: startMarkerImage,
		});
		start.setMap(map);
		setStartMarker(start);

		// Create and place end marker
		const end = new kakao.maps.Marker({
			position: linePath[linePath.length - 1],
			image: endMarkerImage,
		});
		end.setMap(map);
		setEndMarker(end);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [map, route]);

	return null;
};

export default RoutePolyline;
