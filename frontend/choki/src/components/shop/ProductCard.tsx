import React from 'react';
import Image from 'next/image';

import { childWebSocketClient } from '@/lib/ws/WebSocketClient';
import {
	shoppingIdAtom,
	deletePlusItem,
	shoppingListAtom,
} from '@/atoms/shoppingAtom';
import { useAtom } from 'jotai';

interface CartItem {
	barcode: string;
	productName: string;
	image: string;
	quantity: number;
}

interface ShoppingCardProps {
	role: string;
	ParentsShoppingItem: {
		title: string;
		count: number;
		image: string;
		barcode: string;
	};
	ChildrenShoppingItem?: CartItem;
	onCameraClick: () => void;
	onDelete: (barcode: string) => void;
}

const ProductCard: React.FC<ShoppingCardProps> = ({
	role,
	ParentsShoppingItem,
	ChildrenShoppingItem,
	onCameraClick,
	onDelete,
}) => {
	const [shoppingId] = useAtom(shoppingIdAtom);
	const [, setShoppingList] = useAtom(shoppingListAtom);
	const handleDelete = () => {
		if (ChildrenShoppingItem) {
			const requestBody = {
				shoppingId: shoppingId,
				listBarcode: ParentsShoppingItem.barcode,
				barcode: ChildrenShoppingItem.barcode,
			};
			childWebSocketClient.sendMessage(
				'/pub/shopping/product/delete',
				requestBody,
			);

			if (ParentsShoppingItem.barcode === '') {
				console.log(
					'아이가 추가한 물품 삭제 ParentsShoppingItem',
					ParentsShoppingItem,
				);
				deletePlusItem(setShoppingList, ChildrenShoppingItem.barcode); // 아이가 추가한 물품 삭제
			} else {
				console.log(
					'부모가 추가한 물품 삭제 ParentsShoppingItem',
					ParentsShoppingItem,
				);
				onDelete(ParentsShoppingItem.barcode); // 부모가 추가한 물품 삭제
			}
		}
	};

	const isParentItemValid =
		ParentsShoppingItem.title &&
		ParentsShoppingItem.count &&
		ParentsShoppingItem.image &&
		ParentsShoppingItem.barcode;

	return (
		<div className="relative flex items-stretch px-8 py-4 border border-gray-200 rounded-2xl max-w-xl mx-auto shadow-md">
			<div className="absolute top-4 bottom-4 left-1/2 transform -translate-x-1/2 w-px bg-gray-200"></div>

			{/* Left Section */}
			<div className="flex flex-col items-center w-1/2 pr-6 h-full justify-center">
				{isParentItemValid ? (
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
						<p className="text-gray-900 font-medium text-base">
							{ParentsShoppingItem.title}
						</p>
						<p className="text-gray-500 text-sm">
							수량:{' '}
							<span className="font-semibold">
								{ParentsShoppingItem.count}개
							</span>
						</p>
					</>
				) : (
					<p className="text-gray-500 text-center mt-10">
						아이가 추가한 상품이에요
					</p>
				)}
			</div>

			{/* Right Section */}
			<div className="flex flex-col items-center w-1/2 pl-6 h-full justify-center relative">
				{role === 'CHILD' && ChildrenShoppingItem && (
					<div className="absolute top-1 -right-4 cursor-pointer">
						<Image
							src="/icons/waste_basket.svg"
							alt="삭제 아이콘"
							width={20}
							height={20}
							onClick={handleDelete}
						/>
					</div>
				)}
				{role === 'PARENTS' && (
					<div className="absolute top-1 -right-4 transform -translate-y-1/4 cursor-pointer">
						<Image
							src="/icons/mini_warning.svg"
							alt="경고 아이콘"
							width={30}
							height={30}
							onClick={() => console.log('경고 아이콘 클릭')}
						/>
					</div>
				)}

				{role === 'CHILD' && !ChildrenShoppingItem ? (
					<div className="w-12 h-12 mb-2 flex items-center justify-center">
						<Image
							src="/icons/camera_icon.svg"
							alt="카메라 아이콘"
							layout="fixed"
							width={48}
							height={48}
							onClick={onCameraClick}
						/>
					</div>
				) : (
					<>
						<div className="w-20 h-20 mb-0 flex items-center justify-center">
							<Image
								src={ChildrenShoppingItem?.image || '/icons/default_image.svg'}
								alt="상품 이미지"
								layout="fixed"
								width={64}
								height={96}
							/>
						</div>
						<p className="text-gray-900 font-medium text-base">
							{ChildrenShoppingItem?.productName}
						</p>
						<p className="text-gray-500 text-sm">
							수량:{' '}
							<span className="font-semibold">
								{ChildrenShoppingItem?.quantity}개
							</span>
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default ProductCard;
