import type { NextConfig } from 'next';

const withPWA = require('next-pwa')({
	dest: 'public', // PWA 파일이 저장될 위치 설정
	register: true, // 서비스 워커를 등록
	skipWaiting: true, // 새로운 서비스 워커가 대기하지 않고 즉시 활성화
	// customWorkerDir: 'path/to/your/custom/sw', // 사용자 정의 서비스 워커 디렉토리 경로
});

const nextConfig: NextConfig = {
	reactStrictMode: false,
	// 이미지 도메인 설정 추가
	images: {
		domains: [
			'www.koreannet.or.kr',
			'choki.co.kr',
			'choki-s3.s3.ap-southeast-2.amazonaws.com',
		],
	},
	// WebAssembly 파일을 위한 headers 설정 추가
	async headers() {
		return [
			{
				source: '/unity-build/:all*(.wasm)', // 모든 .wasm 파일에 대해 설정
				headers: [
					{
						key: 'Content-Type',
						value: 'application/wasm', // WebAssembly 파일에 MIME 타입 지정
					},
				],
			},
		];
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});
		return config;
	},
};

module.exports = withPWA(nextConfig);
export default nextConfig;
