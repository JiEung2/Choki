import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getDoneMissionList } from '@/lib/api/mission';
import MissionList from '@/components/Gallery/MissionList';

export default function Index() {
	const router = useRouter();
	const [missions, setMissions] = useState<DoneMissionResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const { childId } = router.query;

	useEffect(() => {
		const fetchMissions = async () => {
			try {
				if (!childId) return;
				const missionData = await getDoneMissionList(childId as string);
				setMissions(missionData);
			} catch (error) {
				console.error('Failed to fetch missions:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMissions();
	}, [childId]);
	const handleGoBack = () => {
		router.back();
	};

	return (
		<>
			<div className="flex flex-col w-full max-w-md mx-auto bg-light_yellow min-h-screen pb-24">
				<div className="flex m-5 items-center gap-24 mt-8 mb-10">
					<Image
						src="/icons/previous_nav.svg"
						alt="previous_icon"
						className="w-10 h-10 cursor-pointer rounded-2xl shadow-xl mr-2"
						onClick={handleGoBack}
						width={48}
						height={48}
					/>
					<div className="font-bold text-xl">미션 기록</div>
				</div>
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
					</div>
				) : (
					<div className="grid grid-cols-2 gap-4 px-5 overflow-y-auto touch-pan-y h-[calc(100vh-225px)]">
						{missions.map(mission => (
							<MissionList
								key={mission.missionId}
								childId={childId as string}
								missionId={mission.missionId}
								completedAt={new Date(mission.completedAt)
									.toLocaleDateString('ko-KR', {
										year: '2-digit',
										month: '2-digit',
										day: '2-digit',
									})
									.replace(/\. /g, '.')
									.slice(0, -1)}
								image={mission.image}
								type={mission.type as MissionType}
							/>
						))}
					</div>
				)}
				<BottomNavbar />
			</div>
		</>
	);
}
