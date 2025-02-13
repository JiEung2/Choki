import React from 'react';
import CommonModal from './index';

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	message?: string;
}

const SuccessModal = ({
	isOpen,
	onClose,
	message = '경로가 성공적으로 저장되었습니다!',
}: SuccessModalProps) => {
	return (
		<CommonModal isOpen={isOpen} onClose={onClose} size="small">
			<div className="flex flex-col items-center justify-center h-full text-center">
				<h2 className="text-xl font-bold mb-4">성공!</h2>
				<p className="text-center mb-6">{message}</p>
				<button
					onClick={onClose}
					className="mt-4 bg-orange_main text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
				>
					닫기
				</button>
			</div>
		</CommonModal>
	);
};

export default SuccessModal;
