import axiosInstance from '@/lib/api/axiosInstance';

export const getKidDataFromParent = async (
	childId: number,
): Promise<KidDataResponseFromParent> => {
	const response = await axiosInstance.get(`/api/family/info/${childId}`);
	return response.data;
};

export const getInProgressMissionList = async (
	childId: number,
): Promise<InProgressMissionResponse[]> => {
	const response = await axiosInstance.get(
		`/api/mission/inProgress?userId=${childId}`,
	);
	return response.data;
};

export const getNotification = async (
	childId: number,
): Promise<NotificationResponse[]> => {
	const response = await axiosInstance.get(`/api/notification/${childId}`);
	return response.data;
};
