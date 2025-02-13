import React from 'react';

const nonCloseModalLarge = ({ children }: nonCloseModalProps) => {
	return (
		<div className="fixed z-50 flex items-center justify-center">
			{/* Modal */}
			<div
				className="
					relative 
					bg-white 
					rounded-2xl
					shadow-lg 
					p-6
					overflow-y-auto
					scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-amber-500 scrollbar-track-gray-100
				"
				style={{ width: '316px', height: '550px', maxHeight: '80vh' }} // maxHeight 추가
			>
				{/* Content */}
				<div className="h-full w-full flex justify-center">{children}</div>
			</div>
		</div>
	);
};

export default nonCloseModalLarge;
