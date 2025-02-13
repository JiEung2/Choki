import Image from 'next/image';

interface AddItemPromptProps {
	onClick: () => void;
}

const AddItemPrompt: React.FC<AddItemPromptProps> = ({ onClick }) => (
	<div className="flex items-center justify-center p-4 rounded-lg shadow-lg bg-light_yellow_kid mt-4 w-full max-w-md mx-auto">
		<span className="text-lg font-semibold mr-2">물건을 추가로 담을래요!</span>
		<Image
			src="/icons/carmera_icon.svg"
			alt="Camera Icon"
			width={24}
			height={24}
			onClick={onClick} // Image 클릭 시 onClick 이벤트 실행
			className="cursor-pointer"
		/>
	</div>
);

export default AddItemPrompt;
