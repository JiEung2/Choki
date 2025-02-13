import axiosInstance from './axiosInstance';

// 상세 미션 조회
export const getMissionDetail = async (
	missionId: string,
): Promise<MissionDetailResponse> => {
	try {
		const response = await axiosInstance.get(`/api/mission/${missionId}`);
		return response.data;
	} catch (error) {
		console.error('Error in missionDetail:', error);
		throw error;
	}
};

// 미션 완료 승인 (부모)
export const acceptMission = async (
	requestBody: MissionAcceptRequest,
): Promise<any> => {
	try {
		const response = await axiosInstance.post(
			`/api/mission/accept`,
			requestBody,
		);
		return response;
	} catch (error) {
		console.error('미션 accpet 실패:', error);
		throw error;
	}
};

export const getDoneMissionList = async (
	childId: string,
): Promise<DoneMissionResponse[]> => {
	const response = await axiosInstance.get('/api/mission/completed', {
		params: {
			userId: childId,
		},
	});
	return response.data;
};
