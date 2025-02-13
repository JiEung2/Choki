import Image from 'next/image';
import React from 'react';

interface OffRouteModalProps {
	onClose: () => void;
	onCallChild: () => void;
}

const OffRouteModal: React.FC<OffRouteModalProps> = ({
	onClose,
	onCallChild,
}) => {
	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			onClick={onClose}
		>
			<div
				className="bg-transparent rounded-xl p-6 w-80 flex flex-col items-center"
				onClick={e => e.stopPropagation()}
			>
				<Image
					src="/icons/warning.svg"
					alt="위험 사이렌"
					width={300}
					height={300}
				/>
				<p className="w-full bg-red_warning text-white text-xl rounded-2xl py-3 mb-3 mt-5 flex items-center justify-center gap-2">
					경로를 벗어났습니다
				</p>

				<button
					onClick={onCallChild}
					className="w-full bg-white rounded-2xl text-xl py-3 mb-3 flex items-center justify-center gap-2"
				>
					<Image
						src="/icons/call_icon.svg"
						alt="전화 아이콘"
						width={30}
						height={30}
					/>
					<span className="text-gray-700">아이에게 전화걸기</span>
				</button>
			</div>
		</div>
	);
};

export default OffRouteModal;
