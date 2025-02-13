module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'next/core-web-vitals',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended',
	],
	plugins: ['prettier', '@typescript-eslint'],
	rules: {
		// 선언되지 않은 변수 또는 임포트 구문 정리 규칙
		'no-undef': 'off', // TypeScript와 함께 사용 시 비활성화
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-explicit-any': 'off',
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.ts'],
			},
		},
	},
};
