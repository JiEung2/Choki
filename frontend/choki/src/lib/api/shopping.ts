import axiosInstance from '@/lib/api/axiosInstance';
// const baseURL = process.env.NEXT_PUBLIC_API_URL;
const baseURL = 'https://choki.co.kr';

// 상품 검색 API
export const searchItem = async (
	itemName: string,
	page: number,
	size: number,
): Promise<ItemSearchResponse[]> => {
	try {
		const response = await axiosInstance.post(
			`${baseURL}/api/shopping/item/search`,
			{
				itemName,
				page,
				size,
			},
		);
		return response.data;
	} catch (error) {
		console.error('Error in searchItem:', error);
		throw error;
	}
};

// 장보기 최종 부여 모달
export const createShopping = async (
	requestBody: ShoppingRequest,
): Promise<any> => {
	try {
		const response = await axiosInstance.post(
			`/api/shopping/create`,
			requestBody,
		);
		return response.data;
	} catch (error) {
		console.error('장보기 미션 생성 실패:', error);
		throw error;
	}
};

// 장보기 비교
export const compareShopping = async ({
	originBarcode,
	inputBarcode,
}: conmpareRequest): Promise<matchStatusReponse> => {
	try {
		console.log('장보기 비교 요청2:', originBarcode, inputBarcode);
		const response = await axiosInstance.post(`/api/shopping/item/compare`, {
			originBarcode,
			inputBarcode,
		});
		console.log('장보기 비교 응답:', response);
		return response.data;
	} catch (error) {
		console.error('장보기 비교 실패:', error);
		throw error;
	}
};
export const createMission = async (
	requestBody: MissionRequest,
): Promise<any> => {
	try {
		const response = await axiosInstance.post(`/api/mission`, requestBody);
		return response.data;
	} catch (error) {
		console.error('미션 생성 실패:', error);
		throw error;
	}
};
// 미션 완료 이미지 전송(장보기 제외)
export const uploadMissionImage = async (missionId: string, image: File) => {
	const formData = new FormData();

	formData.append('image', image);

	const dataObject = { missionId: missionId };
	formData.append(
		'data',
		new Blob([JSON.stringify(dataObject)], { type: 'application/json' }),
	);

	try {
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

// 장보기 완료 이미지 전송
export const uploadShoppingImage = async (shoppingId: string, image: File) => {
	const formData = new FormData();
	console.log(`Image file size: ${image.size} bytes`); // 이미지 파일 크기 출력

	formData.append('image', image);

	const dataObject = { shoppingId: shoppingId };
	formData.append(
		'data',
		new Blob([JSON.stringify(dataObject)], { type: 'application/json' }),
	);

	try {
		const response = await axiosInstance.post(`/api/shopping/image`, formData, {
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
