import { useState, useEffect } from 'react';
import Image from 'next/image';
import MissionItem from '@/components/Common/MissionItem';
import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';
import { acceptMission, getMissionDetail } from '@/lib/api/mission';
import { useRouter } from 'next/router';

export default function MissionAcceptPage() {
	const router = useRouter();
	const { childId, missionId } = router.query;
	const [comment, setComment] = useState('');
	const [missionDetail, setMissionDetail] =
		useState<MissionDetailResponse | null>(null);

	useEffect(() => {
		const fetchMissionDetail = async () => {
			if (missionId) {
				try {
					const response = await getMissionDetail(missionId as string);
					console.log(response);
					setMissionDetail(response);
				} catch (error) {
					console.error('Failed to fetch mission detail:', error);
				}
			}
		};

		fetchMissionDetail();
	}, [missionId]);

	const handleAcceptMission = async () => {
		if (!missionId) return;

		try {
			await acceptMission({
				missionId: missionId as string,
				comment,
			});
			router.push(`/parents/${childId}/gallery`); // 미션 완료 목록으로 이동
		} catch (error) {
			console.error('Failed to accept mission:', error);
		}
	};

	if (!missionDetail) return;

	return (
		<>
			<div className="flex flex-col w-full max-w-md mx-auto bg-light_yellow min-h-screen pb-24">
				<div className="flex items-center p-4 relative mt-5">
					<button onClick={() => router.back()} className="p-2 absolute left-4">
						<Image
							src="/icons/previous_nav.svg"
							alt="previous_icon"
							className="w-10 h-10 cursor-pointer rounded-2xl shadow-xl mr-2"
							width={48}
							height={48}
						/>
					</button>
					<h1 className="w-full text-center text-xl font-bold">
						{missionDetail.completedAt?.split('T')[0].replace(/-/g, '.')}
					</h1>
				</div>

				<div className="flex justify-center mt-5">
					<MissionItem
						type={missionDetail.type as MissionType}
						content={missionDetail.content}
					/>
				</div>

				<div className="flex justify-center items-center mt-2">
					<div className="w-[330px] h-[330px] rounded-2xl bg-gray-100">
						<div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
							{missionDetail.image && (
								<Image
									src={missionDetail.image}
									alt="Mission completed"
									width={330}
									height={330}
									className="rounded-lg object-cover"
									sizes="330px"
								/>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center">
					<div className="flex mt-4">
						<div className="mr-20 text-lg font-bold mb-2">한마디</div>
						<div className="ml-28 text-gray-500">{comment.length}/100</div>
					</div>
					<textarea
						value={comment}
						onChange={e => setComment(e.target.value)}
						placeholder="아이의 심부름에 대해 기록해주세요!"
						className="w-[310px] p-3 min-h-[20px] resize-none rounded-3xl border-2 border-black"
						maxLength={100}
					/>
					<button
						onClick={handleAcceptMission}
						className="w-[80px] h-[40px] bg-orange_main text-white rounded-lg font-bold text-center mt-3"
					>
						확인
					</button>
				</div>
			</div>
			<BottomNavbar />
		</>
	);
}
