import ChildNavbar from '@/components/Common/Navbar/ChildNavBar';
import AnimalSpeech from '@/components/Recycle/AnimalSpeech';
import Cam from '@/components/Recycle/Cam';
import Button from '@/components/Common/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MissionCompleteModal from '@/components/Common/Modal/MissionCompleteModal';

const RecyclePage = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const router = useRouter();
	const { missionId } = router.query;
	const closeMissionFinishModal = () => {
		setIsModalOpen(false);
	};

	const [classifyResult, setClassifyResult] = useState<
		RecycleResponse | undefined
	>(undefined);

	const [animalMessage, setAnimalMessage] = useState<string>();
	const [completeFlag, setCompleteFlag] = useState<boolean>(false);

	const handleComplete = () => {
		setAnimalMessage(`재활용을 마무리 할래? 인증 사진 찰칵~`);
		setCompleteFlag(true);
		setIsModalOpen(true);
	};

	useEffect(() => {
		// console.log(classifyResult);
		setAnimalMessage(
			classifyResult
				? classifyResult.predictions.length > 0
					? `이건 ${classifyResult!.predictions[0].name}인 것 같은데?`
					: '쓰레기가 더 잘 보이도록 다시 찍어볼까?'
				: '헷갈리는 쓰레기는 사진을 찍어봐!',
		);
	}, [classifyResult]);

	return (
		<div
			className="min-h-screen bg-cover bg-center flex flex-col items-center pt-5 pb-20 px-4 sm:px-8"
			style={{
				backgroundImage: "url('/icons/recycle_background.svg')",
			}}
		>
			{isModalOpen && missionId ? (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="relative">
						<MissionCompleteModal missionId={missionId as string} />
						<button
							onClick={closeMissionFinishModal}
							className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full"
						>
							X
						</button>
					</div>
				</div>
			) : (
				<>
					<div className="-mt-6 md:mt-0">
						<AnimalSpeech animalMessage={animalMessage} />
					</div>

					<div className="mt-3 mb-8 w-full max-w-md">
						<Cam
							onCaptureChange={setClassifyResult}
							completeFlag={completeFlag}
						/>
					</div>

					<div className="flex justify-center">
						<Button
							size="small"
							color="orange"
							onClick={handleComplete}
							text="완료"
						/>
					</div>
				</>
			)}

			<div className="fixed bottom-0 w-full">
				<ChildNavbar />
			</div>
		</div>
	);
};

export default RecyclePage;
