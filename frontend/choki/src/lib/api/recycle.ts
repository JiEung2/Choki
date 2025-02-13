import axiosInstance from '@/lib/api/axiosInstance';
import axios from 'axios';

interface TempRecycleResponse {
	status: number;
	data: RecycleResponse;
	message: string;
}

export const classifyRecycle = async (
	formData: FormData,
): Promise<TempRecycleResponse> => {
	const response = await axios.post(
		'https://choki.co.kr/ai/predict',
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		},
	);
	// const response = await axiosInstance.post('/ai/predict', formData, {
	// 	headers: {
	// 		'Content-Type': 'multipart/form-data',
	// 	},
	// });
	return response.data;
};

// export const finishRecycle = async (formData: FormData) => {
// 	const response = await axiosInstance.post('/api/mission/image', formData, {
// 		headers: {
// 			'Content-Type': 'multipart/form-data',
// 		},
// 	});
// 	return response.data;
// };

// 재활용 미션 완료 전송
export const finishRecycle = async (
	missionId: string | string[] | undefined,
	image: File,
) => {
	const formData = new FormData();

	formData.append('image', image);

	const dataObject = { missionId: missionId };
	formData.append(
		'data',
		new Blob([JSON.stringify(dataObject)], { type: 'application/json' }),
	);

	try {
		console.log(missionId);
		console.log(formData);

		const response = await axiosInstance.post(`/api/mission/image`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	} catch (error) {
		console.error('이미지 업로드 실패:', error);
		throw error;
	}
};
