// Access Token 설정
export const setAccessToken = (token: string) => {
	localStorage.setItem('access', token);
};

// access Token 가져오기
export const getAccessToken = () => {
	return localStorage.getItem('access');
};

// Access Token 삭제
export const removeAccessToken = () => {
	localStorage.removeItem('access');
};
