// components/Common/SpeechBubble.js

export default function SpeechBubble({ speech }: Speech) {
	return (
		<div className="relative bg-yellow-100 rounded-2xl px-6 py-3 text-black shadow-md max-w-[220px] border border-yellow-400">
			<p className="text-lg font-semibold">{speech}</p>
			<div
				className="absolute -right-3 top-1/3 transform -translate-y-1/2"
				style={{
					width: '0',
					height: '0',
					borderLeft: '12px solid #FEF3C7', // 말풍선 색상과 일치
					borderTop: '8px solid transparent',
					borderBottom: '8px solid transparent',
				}}
			></div>
		</div>
	);
}
