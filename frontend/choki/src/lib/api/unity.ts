import axiosInstance from '@/lib/api/axiosInstance';

export const changeMainAnimal = async (animalId: number): Promise<void> => {
	try {
		await axiosInstance.put(`/api/collected/animal/${animalId}/main`);
	} catch (error) {
		console.error('Error in changing main animal:', error);
		throw error;
	}
};
