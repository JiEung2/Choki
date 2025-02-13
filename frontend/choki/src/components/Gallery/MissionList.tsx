import { useRouter } from 'next/router';
import Image from 'next/image';
import { MISSION_IMAGES } from '@/constants/mission';

interface MissionListProps {
	childId: string;
	missionId: string;
	completedAt: string;
	image: string;
	type: string;
}

const MissionList: React.FC<MissionListProps> = ({
	childId,
	missionId,
	completedAt,
	image,
	type,
}) => {
	const router = useRouter();
	const handleMissionDetail = () => {
		router.push(`/parents/${childId}/gallery/${missionId}`);
	};
	return (
		<div
			className="relative w-[160px] h-[185px] bg-gray-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer"
			onClick={handleMissionDetail}
		>
			<div className="absolute top-0 left-0 w-10 h-10 z-10">
				<Image
					src={MISSION_IMAGES[type as MissionType]}
					alt={`${type} icon`}
					fill
				/>
			</div>
			{/* <div className="flex flex-col items-center gap-1">
				<Image
					src={image}
					alt="mission_img"
					width={130}
					height={130}
					className="rounded-2xl mt-4"
				/>
				<span className="text-md font-semibold text-gray-600">
					{completedAt}
				</span>
			</div> */}
			<div className="relative w-[130px] h-[130px] rounded-2xl overflow-hidden mt-3">
				<Image
					src={image}
					alt="mission_img"
					fill
					className="object-cover"
					sizes="130px"
				/>
			</div>
			<span className="text-sm mt-2 font-semibold text-gray-600">
				{completedAt}
			</span>
		</div>
	);
};

export default MissionList;
