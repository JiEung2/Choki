import React from 'react';
import X from '@/../public/icons/close_icon.png';
import Image from 'next/image';

const CommonModal = ({
	isOpen,
	onClose,
	size = 'medium',
	children,
	hideBackdrop = true, // hideBackdrop prop 추가
}: ModalProps & { hideBackdrop?: boolean }) => {
	if (!isOpen) return null;

	const sizeStyles = {
		small: 'w-[300PX] h-[300px]',
		medium: 'w-[300px] h-[500px]',
		large: 'w-[300px] h-[700px]',
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop - hideBackdrop이 true일 때는 배경 효과 제거 */}
			{!hideBackdrop && (
				<div className="absolute inset-0 bg-black/50" onClick={onClose} />
			)}

			{/* Modal */}
			<div
				className={`
			  relative 
			  bg-white 
			  rounded-lg 
			  shadow-lg 
			  ${sizeStyles[size]}
			  p-6
			`}
			>
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100"
				>
					<Image
						src={X}
						alt="close"
						width={20}
						height={20}
						className="object-contain"
					/>
				</button>
				{/* Content */}
				<div className="h-full w-full">{children}</div>
			</div>
		</div>
	);
};

export default CommonModal;
