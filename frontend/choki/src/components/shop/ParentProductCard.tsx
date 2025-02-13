import React from 'react';
import Image from 'next/image';
// import MiniWarning from '@/assets/icons/mini_warning.svg';
import { useState, useEffect } from 'react';

const ParentProductCard: React.FC<ParentShoppingCardProps> = ({
	ParentsShoppingItem,
	ChildrenShoppingItem,
	showWarning,
	emptyMessage,
	reason,
}) => {
	const [showOverlay, setShowOverlay] = useState(false);

	const handleWarningClick = () => {
		if (reason === 'SOLD_OUT') {
			setShowOverlay(prev => !prev);
		}
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (showOverlay) {
			timer = setTimeout(() => {
				setShowOverlay(false);
			}, 1000);
		}
		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [showOverlay]);

	return (
		<div className="relative flex items-stretch px-8 py-4 border bg-white border-gray-200 rounded-2xl max-w-xl mx-auto shadow-md">
			{/* Sold Out Overlay */}
			{showOverlay && reason === 'SOLD_OUT' && (
				<div className="absolute inset-0 bg-black/70 rounded-2xl z-10 flex items-center justify-center">
					<p className="text-white text-lg font-semibold">품절된 상품이에요</p>
				</div>
			)}

			<div className="absolute top-4 bottom-4 left-1/2 transform -translate-x-1/2 w-px bg-gray-200"></div>

			{/* Left Section (부모 아이템) */}
			<div className="flex flex-col items-center w-1/2 pr-6 h-full justify-center">
				{ParentsShoppingItem.productName ? (
					<>
						<div className="w-20 h-20 mb-0 flex items-center justify-center">
							<Image
								src={ParentsShoppingItem.image || '/icons/default_image.svg'}
								alt="상품 이미지"
								layout="fixed"
								width={64}
								height={96}
							/>
						</div>
						<p className="text-gray-900 font-medium text-lg">
							{ParentsShoppingItem.productName}
						</p>
						<p className="text-gray-500 text-sm">
							수량:{' '}
							<span className="font-semibold">
								{ParentsShoppingItem.quantity}개
							</span>
						</p>
					</>
				) : (
					<p className="text-gray-500 mt-10">{emptyMessage}</p>
				)}
			</div>

			{/* Right Section (자녀 아이템) */}
			<div className="flex flex-col items-center w-1/2 pl-6 h-full justify-center relative">
				{showWarning && (
					<div
						className="absolute top-1 -right-4 transform -translate-y-1/4 cursor-pointer"
						onClick={handleWarningClick}
					>
						<Image
							src="/icons/mini_warning.svg"
							alt="경고 아이콘"
							width={30}
							height={30}
						/>
					</div>
				)}

				{ChildrenShoppingItem ? (
					<>
						<div className="w-20 h-20 mb-0 flex items-center justify-center">
							<Image
								src={ChildrenShoppingItem.image || '/icons/default_image.svg'}
								alt="상품 이미지"
								layout="fixed"
								width={64}
								height={96}
							/>
						</div>
						<p className="text-gray-900 font-medium text-lg">
							{ChildrenShoppingItem.productName}
						</p>
						<p className="text-gray-500 text-sm">
							수량:{' '}
							<span className="font-semibold">
								{ChildrenShoppingItem.quantity}개
							</span>
						</p>
					</>
				) : (
					<p className="text-gray-500 mt-10">{emptyMessage}</p>
				)}
			</div>
		</div>
	);
};

export default ParentProductCard;
