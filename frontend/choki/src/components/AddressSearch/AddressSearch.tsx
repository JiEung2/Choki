import React, { useEffect, useRef } from 'react';
import X from '@/../public/icons/close_icon.png';
import Image from 'next/image';

// Postcode 옵션 인터페이스
interface PostcodeOptions {
	oncomplete: (data: PostcodeResult) => void;
	onclose?: () => void;
	width: string;
	height: string;
}

// 전역 타입 선언
declare global {
	interface Window {
		daum: {
			Postcode: new (options: PostcodeOptions) => {
				embed: (element?: HTMLElement) => void;
				open: () => void;
			};
		};
		kakao: {
			maps: {
				load: (callback: () => void) => void;
				services: {
					Geocoder: new () => {
						addressSearch: (
							address: string,
							callback: (
								result: Array<{
									x: string; // longitude
									y: string; // latitude
								}>,
								status: string,
							) => void,
						) => void;
					};
					Status: {
						OK: string;
						ZERO_RESULT: string;
						ERROR: string;
					};
				};
			};
		};
	}
}

interface AddressSearchProps {
	onComplete: (data: {
		address: string;
		zonecode: string;
		latitude?: number;
		longitude?: number;
	}) => void;
	onClose: () => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
	onComplete,
	onClose,
}) => {
	const postcodeRef = useRef<any>(null);

	// 주소를 위도/경도로 변환하는 함수
	const getGeocode = async (
		address: string,
	): Promise<{ latitude: number; longitude: number } | null> => {
		return new Promise(resolve => {
			if (typeof window === 'undefined' || !window.kakao?.maps?.services) {
				console.error('Kakao Maps API가 로드되지 않았습니다.');
				resolve(null);
				return;
			}

			const geocoder = new window.kakao.maps.services.Geocoder();

			geocoder.addressSearch(address, (result, status) => {
				if (
					status === window.kakao.maps.services.Status.OK &&
					result.length > 0
				) {
					resolve({
						latitude: parseFloat(result[0].y),
						longitude: parseFloat(result[0].x),
					});
				} else {
					console.error('주소를 변환할 수 없습니다.');
					resolve(null);
				}
			});
		});
	};

	useEffect(() => {
		const initPostcode = () => {
			const container = document.getElementById('address-search-container');
			if (!container) return;

			if (postcodeRef.current) {
				postcodeRef.current = null;
			}

			postcodeRef.current = new window.daum.Postcode({
				oncomplete: async (data: PostcodeResult) => {
					// 위도/경도 가져오기
					const geoLocation = await getGeocode(data.address);

					onComplete({
						address: data.address,
						zonecode: data.zonecode,
						...(geoLocation && {
							latitude: geoLocation.latitude,
							longitude: geoLocation.longitude,
						}),
					});

					onClose();
				},
				onclose: onClose,
				width: '100%',
				height: '100%',
			});

			setTimeout(() => {
				if (postcodeRef.current) {
					postcodeRef.current.embed(container);
				}
			}, 100);
		};

		// Kakao Maps API 로드 확인 및 초기화
		if (typeof window !== 'undefined' && window.kakao) {
			window.kakao.maps.load(() => {
				if (window.daum) {
					initPostcode();
				}
			});
		}

		return () => {
			if (postcodeRef.current) {
				postcodeRef.current = null;
			}
		};
	}, [onComplete, onClose]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black bg-opacity-50"
				onClick={onClose}
			/>
			<div className="relative bg-white rounded-lg w-[300px] max-w-md">
				<div className="flex justify-between items-center p-4 border-b">
					<h3 className="text-lg font-medium">주소 검색</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
						type="button"
					>
						<Image src={X} alt="닫기버튼"></Image>
					</button>
				</div>
				<div id="address-search-container" className="h-[400px]" />
			</div>
		</div>
	);
};

export default AddressSearch;
