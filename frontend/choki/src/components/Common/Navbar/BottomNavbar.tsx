import Image from 'next/image';
import { useRouter } from 'next/router';

export default function BottomNavbar() {
	const router = useRouter();
	const { childId } = router.query;

	const handleHomeClick = () => {
		router.push('/parents');
	};

	const handleGalleryClick = () => {
		if (childId) {
			router.push(`/parents/${childId}/gallery`);
		}
	};

	return (
		<nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[330px] h-[87px] bg-white rounded-2xl shadow-lg flex items-center justify-center">
			<div className="flex gap-16">
				<div
					className="flex flex-col items-center cursor-pointer"
					onClick={handleHomeClick}
				>
					<div className="w-16 h-16 flex items-center justify-center mt-1">
						<Image
							src="/icons/home_nav.svg"
							alt="home_nav"
							width={62}
							height={62}
							priority
						/>
					</div>
				</div>

				<div
					className="flex flex-col items-center cursor-pointer"
					onClick={handleGalleryClick}
				>
					<div className="w-16 h-16 flex items-center justify-center">
						<Image
							src="/icons/gallery_nav.svg"
							alt="gallery_nav"
							width={62}
							height={62}
							className="w-auto h-auto"
							priority
						/>
					</div>
				</div>
			</div>
		</nav>
	);
}
