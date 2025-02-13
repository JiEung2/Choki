import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { saveRoute } from '@/lib/api/navigation';
import SuccessModal from '../Common/Modal/RouteSaveSuccessModal';

const SetDestination = ({
	onClose,
	route,
}: {
	onClose: () => void;
	route: { latitude: number; longitude: number }[];
}) => {
	const [destination, setDestination] = useState<string>('');
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const router = useRouter();

	const closeModal = () => {
		setIsSuccessModalOpen(false);
		onClose();
		router.push('/parents');
	};

	const handleAddClick = async () => {
		if (destination.trim() === '') {
			alert('목적지를 입력해주세요.');
			return;
		}

		console.log('경로 저장 요청 보냄');

		if (route.length === 0) {
			console.error('경로 데이터가 없습니다.');
			alert('경로 데이터가 없어 목적지를 설정할 수 없습니다.');
			return;
		}

		const lastPoint = route[route.length - 1];
		const dataToSend = {
			route,
			destination: {
				latitude: lastPoint.latitude,
				longitude: lastPoint.longitude,
				buildingName: destination,
			},
		};

		console.log('최종 데이터:', dataToSend);

		try {
			const response = await saveRoute(route, {
				latitude: lastPoint.latitude,
				longitude: lastPoint.longitude,
				buildingName: destination,
			});

			console.log('경로 저장 성공:', response);

			setIsSuccessModalOpen(true);
		} catch (error) {
			console.error('경로 저장 실패:', error);
		}
	};

	return (
		<>
			<SuccessModal
				isOpen={isSuccessModalOpen}
				onClose={closeModal}
				message="경로가 성공적으로 저장되었습니다!"
			/>

			<div
				style={{
					position: 'absolute',
					left: '50%',
					transform: 'translateX(-50%)',
					zIndex: 10,
					width: '100%',
					maxWidth: '500px',
					padding: '20px',
					backgroundColor: 'white',
					borderRadius: '20px',
					boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
					border: '1px solid #ddd',
					overflow: 'hidden',
				}}
			>
				<button
					onClick={onClose}
					style={{
						position: 'absolute',
						top: '15px',
						right: '15px',
						backgroundColor: 'transparent',
						border: 'none',
						fontSize: '20px',
						cursor: 'pointer',
						zIndex: '11',
					}}
				>
					&times;
				</button>

				<h2
					style={{ margin: '40px 0 0', fontSize: '20px', fontWeight: 'bold' }}
				>
					경로 등록하기
				</h2>

				<div style={{ position: 'relative', marginTop: '40px' }}>
					<input
						type="text"
						placeholder="목적지를 입력하세요"
						value={destination}
						onChange={e => setDestination(e.target.value)}
						style={{
							width: '100%',
							padding: '10px 40px 10px 10px',
							borderRadius: '10px',
							border: '1px solid #ccc',
							fontSize: '16px',
						}}
					/>

					<button
						onClick={handleAddClick}
						style={{
							position: 'absolute',
							top: '50%',
							right: '10px',
							transform: 'translateY(-50%)',
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							padding: 0,
						}}
					>
						<Image
							src="/icons/plus_btn.png"
							alt="Add Icon"
							width={24}
							height={24}
						/>
					</button>
				</div>

				<div
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
					}}
				>
					<Image
						src="/icons/map_icon_blurry.svg"
						alt="Icon"
						width={90}
						height={90}
						style={{ width: '120px', height: '120px', marginTop: '10px' }}
					/>
				</div>
			</div>
		</>
	);
};

export default SetDestination;
