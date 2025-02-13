import { useEffect } from 'react';

interface ToastProps {
	message: string;
	onClose: () => void;
}

export const Toast = ({ message, onClose }: ToastProps) => {
	useEffect(() => {
		// 3초 후에 onClose 호출하여 Toast를 닫음
		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		// 컴포넌트가 언마운트될 때 타이머 정리
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			className="fixed bottom-10 left-1/2 transform -translate-x-1/2 animate-fade-up"
			style={{ zIndex: 1000 }} // 높은 z-index 설정
		>
			<div className="bg-black bg-opacity-80 text-white px-6 py-3 rounded-full shadow-lg">
				{message}
			</div>
		</div>
	);
};
