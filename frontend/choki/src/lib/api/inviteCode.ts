import axiosInstance from './axiosInstance';

// 초대 코드 생성
export const createInviteCode = async (): Promise<InviteCodeResponse> => {
	const response = await axiosInstance.post('/api/family');
	return response.data;
};

// 초대 코드 조회
export const getInviteCode = async (): Promise<InviteCodeResponse> => {
	const response = await axiosInstance.get('/api/family/invite-code');
	return response.data;
};

// 초대 코드 입력
export const joinFamily = async (
	inviteCode: string,
): Promise<JoinFamilyResponse> => {
	const response = await axiosInstance.post('/api/family/invite-code/accept', {
		inviteCode,
	});
	console.log('joinFamily response', response);
	return response.data;
};
