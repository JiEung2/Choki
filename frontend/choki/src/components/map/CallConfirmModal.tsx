import React from 'react';

interface CallConfirmModalProps {
	phoneNumber: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const CallConfirmModal: React.FC<CallConfirmModalProps> = ({
	phoneNumber,
	onConfirm,
	onCancel,
}) => {
	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			onClick={onCancel}
		>
			<div
				className="bg-white rounded-xl p-6 w-80 flex flex-col items-center"
				onClick={e => e.stopPropagation()}
			>
				<h3 className="text-lg font-bold mb-4">전화 연결</h3>
				<p className="text-center mb-6">
					{phoneNumber}로<br />
					전화를 연결하시겠습니까?
				</p>
				<div className="flex gap-4 w-full">
					<button
						onClick={onConfirm}
						className="flex-1 py-2 bg-red_warning rounded-lg text-white"
					>
						네
					</button>
					<button
						onClick={onCancel}
						className="flex-1 py-2 bg-gray-200 rounded-lg"
					>
						아니오
					</button>
				</div>
			</div>
		</div>
	);
};

export default CallConfirmModal;
