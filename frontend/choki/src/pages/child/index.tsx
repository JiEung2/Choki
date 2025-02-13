import { Unity, useUnityContext } from 'react-unity-webgl';

export default function ChildMainPage() {
	const { unityProvider } = useUnityContext({
		loaderUrl: 'Build/Build.loader.js',
		dataUrl: 'Build/Build.data',
		frameworkUrl: 'Build/Build.framework.js',
		codeUrl: 'Build/Build.wasm',
	});

	return (
		<div>
			<Unity unityProvider={unityProvider} />
		</div>
	);
}
