import Image from 'next/image';
import Link from 'next/link';

interface ParentsShoppingrNavbarProps {
	childId: string;
	missionId: string;
}

const ParentsShoppingNavbar: React.FC<ParentsShoppingrNavbarProps> = ({
	childId,
	missionId,
}) => {
	return (
		<>
			<nav className="fixed top-6 z-100 w-full left-[50%] transform -translate-x-1/2">
				<div className="h-full flex justify-center items-center gap-8">
					{/* 나가기 버튼 */}
					<Link href={`/parents/${childId}`}>
						<div className="flex mt-2">
							<Image
								src="/icons/previous_nav.svg"
								alt="back_icon"
								width={42}
								height={42}
								className="shadow-md rounded-md"
							/>
						</div>
					</Link>

					{/* 경로 및 장바구니 버튼 */}
					<div className="w-[190px] h-[60px] bg-white rounded-full flex justify-center items-center shadow-lg">
						<Link href={`/parents/${childId}/shop/${missionId}/route`}>
							<button className="p-2">
								<Image
									src="/icons/map.svg"
									alt="map_icon"
									width={55}
									height={55}
								/>
							</button>
						</Link>

						<div className="w-px h-8 bg-light_yellow_nav mx-2" />

						<Link href={`/parents/${childId}/shop/${missionId}/list`}>
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

export default ParentsShoppingNavbar;
