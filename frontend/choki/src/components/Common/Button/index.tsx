import React from 'react';
import Image from 'next/image';

export default function Button({
	size = 'medium',
	color = 'orange',
	onClick,
	text,
}: ButtonProps) {
	// 기본 버튼 스타일
	const baseStyle =
		'font-pretendard font-medium transition-colors duration-200 flex items-center justify-center gap-2';

	// 사이즈별 스타일
	const sizeStyles: Record<ButtonSize, string> = {
		small: 'px-4 py-1 text-sm rounded-full',
		small_mid: 'w-[126px] h-[44px] text-base rounded-[22px]',
		medium: 'w-[240px] h-[50px] text-base rounded-[15px]',
		large: 'w-[315px] h-[50px] text-lg rounded-[20px]',
		call_large: 'w-[315px] h-[65px] text-lg rounded-[20px]',
	};

	// 커스텀 컬러별 스타일
	const colorStyles: Record<ButtonColor, string> = {
		orange: 'bg-orange_main text-white  disabled:bg-orange_main/50',
		white:
			'bg-white text-orange_main border border-orange_main disabled:border-orange_main/50 disabled:text-orange_main/50',
		blue: 'bg-light_blue_btn text-black_mission disabled:bg-light_blue_btn/50',
		gray: 'bg-gray_btn text-white disabled:bg-gray_btn/50',
		red: 'bg-red_warning text-white disabled:bg-red_warning/50',
		white_call:
			'bg-white text-black border border-black disabled:border-black/50 disabled:text-black/50',
	};

	// call_large 사이즈일 때 사용할 아이콘 렌더링 함수
	const renderIcon = () => {
		if (size === 'call_large') {
			return (
				<Image
					src="/icons/call_icon.svg"
					alt="call_icon"
					width={32}
					height={32}
					className="mr-2"
				/>
			);
		}
		return null;
	};

	return (
		<button
			onClick={onClick}
			className={`
        ${baseStyle}
        ${sizeStyles[size]}
        ${colorStyles[color]}
      `}
		>
			{renderIcon()}
			{text}
		</button>
	);
}
