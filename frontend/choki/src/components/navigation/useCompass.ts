import { useEffect, useState } from 'react';

function useCompass() {
	const [direction, setDirection] = useState(0);

	useEffect(() => {
		const handleOrientation = (event: DeviceOrientationEvent) => {
			const { alpha } = event;
			if (alpha !== null) {
				const heading = 360 - alpha;
				console.log(`각도: ${heading}`);
				setDirection(heading);
			}
		};

		window.addEventListener('deviceorientation', handleOrientation, true);

		return () => {
			window.removeEventListener('deviceorientation', handleOrientation);
		};
	}, []);

	return { direction };
}

export default useCompass;
