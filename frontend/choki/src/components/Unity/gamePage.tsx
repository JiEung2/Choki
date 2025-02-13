import React, { useEffect, useRef } from 'react';

interface UnityWebGLProps {
	loaderUrl: string;
	dataUrl: string;
	frameworkUrl: string;
	codeUrl: string;
}

const UnityWebGL: React.FC<UnityWebGLProps> = ({
	loaderUrl,
	dataUrl,
	frameworkUrl,
	codeUrl,
}) => {
	const canvasRef = useRef(null);
	const loadingRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const loadUnityGame = async () => {
			if (typeof window !== 'undefined') {
				const script = document.createElement('script');
				script.src = loaderUrl;
				script.async = true;

				script.onload = () => {
					if (window.createUnityInstance && canvasRef.current) {
						window
							.createUnityInstance(
								canvasRef.current,
								{
									dataUrl: dataUrl,
									frameworkUrl: frameworkUrl,
									codeUrl: codeUrl,
									streamingAssetsUrl: 'StreamingAssets',
									companyName: 'YourCompany',
									productName: 'YourGame',
									productVersion: '1.0',
								},
								progress => {
									if (loadingRef.current) {
										loadingRef.current.innerHTML = `Loading: ${Math.round(progress * 100)}%`;
									}
								},
							)
							// .then((unityInstance: any) => {
							// 	if (loadingRef.current) {
							// 		loadingRef.current.innerHTML = '';
							// 	}
							// })
							.catch(error => {
								console.error('Unity WebGL error:', error);
							});
					}
				};

				document.body.appendChild(script);

				return () => {
					document.body.removeChild(script);
				};
			}
		};

		loadUnityGame();
	}, [loaderUrl, dataUrl, frameworkUrl, codeUrl]);

	return (
		<div className="relative w-full h-full min-h-[600px]">
			<canvas ref={canvasRef} className="w-full h-full bg-black" />
			<div
				ref={loadingRef}
				className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
			/>
		</div>
	);
};

export default UnityWebGL;
