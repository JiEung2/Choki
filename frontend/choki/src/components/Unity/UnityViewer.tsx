import React, { useEffect, useRef } from 'react';

interface UnityViewerProps {
	onUnityLoaded?: () => void;
}

const UnityViewer: React.FC<UnityViewerProps> = ({ onUnityLoaded }) => {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		const handleIframeLoad = () => {
			if (onUnityLoaded) {
				onUnityLoaded();
			}
		};

		const iframe = iframeRef.current;
		if (iframe) {
			iframe.addEventListener('load', handleIframeLoad);
		}

		return () => {
			if (iframe) {
				iframe.removeEventListener('load', handleIframeLoad);
			}
		};
	}, [onUnityLoaded]);

	return (
		<div className="w-full h-screen overflow-hidden">
			<iframe
				ref={iframeRef}
				src="/unity/index.html" // Unity 정적 파일 경로
				className="w-full h-full border-none"
				id="unity-iframe"
				allowFullScreen
				title="Unity WebGL Game"
			/>
		</div>
	);
};

export default UnityViewer;
