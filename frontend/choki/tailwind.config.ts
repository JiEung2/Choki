import type { Config } from 'tailwindcss';
import tailwindScrollbar from 'tailwind-scrollbar';
const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'custom-icon': "url('/src/assets/icons/mart_background.svg')",
			},
			colors: {
				black: '#000000',
				white: '#FFFFFF',
				light_yellow_nav: '#FFF5B9',
				light_yellow_mid: '#FEF4BA',
				orange_main: '#FF9D3D',
				light_yellow_dark: '#FEEE91',
				light_yellow_side: '#F4D19B',
				light_blue_side: '#97D3FF',
				light_yellow: '#FFFBE2',
				black_mission: '#292D32',
				blue_mission: '#CBE9FF',
				light_green_mission: '#BBF7D0',
				green_mission: '#16A34A',
				light_yellow_btn: '#FFF5BB',
				light_orange_del: '#F4D19B',
				red_warning: '#FF5252',
				light_gray_btn: '#B3B3B3',
				red_emergency: '#FF4242',
				ligth_gray_btn_kid: '#F1F1F1',
				gray_btn: '#B3B3B3',
				light_yellow_kid: '#FDFCE5',
				light_blue_btn: '#C4E1F6',
			},
			fontFamily: {
				pretendard: ['pretendard', 'sans-serif'],
			},
			keyframes: {
				'fade-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px) translateX(-50%)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) translateX(-50%)',
					},
				},
			},
			animation: {
				'fade-up': 'fade-up 0.3s ease-out forwards',
			},
		},
	},
	plugins: [tailwindScrollbar],
	variants: {
		scrollbar: ['rounded'],
	},
};

export default config;
