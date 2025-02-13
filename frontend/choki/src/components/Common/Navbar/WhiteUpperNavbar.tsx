import Image from 'next/image';
import Link from 'next/link';

interface UpperNavbarProps {
	missionId: string;
}

const UpperNavbar: React.FC<UpperNavbarProps> = ({ missionId }) => {
	return (
		<>
			<nav className="fixed top-5 z-100 w-full left-[50%] transform -translate-x-1/2">
				<div className="h-full flex justify-center items-center gap-5">
					{/* 나가기 버튼 */}
					<Link href="/child/main">
						<div className="flex mt-2">
							<Image
								src="/icons/back_icon_kid_white.svg"
								alt="back_icon"
								width={65}
								height={65}
							/>
						</div>
					</Link>

					{/* 경로 및 장바구니 버튼 */}
					<div className="w-[190px] h-[60px] bg-white rounded-full flex justify-center items-center shadow-lg">
						<Link href={`/child/shop/${missionId}/route`} legacyBehavior>
							<button className="p-2">
								<Image
									src="/icons/map.svg"
									alt="map_icon"
									width={55}
									height={55}
								/>
							</button>
						</Link>

						<div className="w-px h-8 bg-white mx-2" />

						<Link href={`/child/shop/${missionId}/list`} legacyBehavior>
							<button className="p-2">
								<Image
									src="/icons/basket.svg"
									alt="basket_icon"
									width={55}
									height={55}
								/>
							</button>
						</Link>
					</div>
				</div>
			</nav>
		</>
	);
};

export default UpperNavbar;
