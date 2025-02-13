import React from 'react';
import Image from 'next/image';

const AnimalSpeech: React.FC<AnimalSpeechProps> = ({ animalMessage }) => {
	return (
		<div className="flex justify-center w-full p-2 mt-10">
			{/* 말풍선 */}
			<div
				style={{
					backgroundImage: "url('/icons/recycle_speech_bubble.svg')",
					backgroundSize: 'contain',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					padding: '35px',
					paddingLeft: '26px',
					maxWidth: '200px',
					fontSize: '16px',
					fontWeight: 'bold',
				}}
			>
				{/* 텍스트 */}
				{/* {animalMessage !== undefined
					? animalMessage
					: '헷갈리는 쓰레기는 사진을 찍어봐!'} */}
				{animalMessage}
			</div>

			{/* 동물 */}
			<div>
				<Image
					src="/icons/dog_character.svg"
					alt="강아지 캐릭터"
					width={100}
					height={100}
				/>
			</div>
		</div>
	);
};

export default AnimalSpeech;
