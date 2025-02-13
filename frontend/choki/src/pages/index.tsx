import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
	const router = useRouter();
	// 초기 진입시 로그인 페이지로 이동
	useEffect(() => {
		router.push('/login');
	}, [router]);

	return <div></div>;
}
