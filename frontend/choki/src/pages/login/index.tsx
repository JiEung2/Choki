import { useRouter } from 'next/router';
import React, { useState } from 'react';
import CommonButton from '@/components/Common/Button';
import CommonInput from '@/components/Common/Input';
import Image from 'next/image';
// import MainLogo from '@/../public/icons/choki_icon.svg';
import { loginUser } from '@/lib/api/login';
import { userAtom } from '@/atoms';
import { useAtom } from 'jotai';
import { getSimpleUserInfo } from '@/lib/api/user';

export default function LoginPage() {
	const router = useRouter();
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [user, setUser] = useAtom(userAtom);

	const postLoginData = async (userId: string, userPassword: string) => {
		try {
			const response = await loginUser({ userId, userPassword });
			return response;
		} catch (error) {
			console.error('Error logging in:', error);
		}
	};

	const fetchUserData = async () => {
		try {
			const response = await getSimpleUserInfo();
			const { userId, name } = response;
			setUser({
				userId,
				username: name,
			});
		} catch (err) {
			console.error('사용자 데이터 가져오기 실패:', err);
		}
	};

	const handleLogin = async () => {
		const response = await postLoginData(id, password);
		if (response?.role === 'PARENT') {
			await fetchUserData();
			router.push('/parents');
		} else if (response?.role === 'CHILD') {
			await fetchUserData();
			router.push('/child/main');
		} else {
			alert('로그인에 문제가 발생했습니다.');
		}
	};

	return (
		<div className="bg-light_yellow_mid flex flex-col items-center h-screen pt-[20vh]">
			{/* Logo Container */}
			<div className="w-[120px] h-[120px] mb-16">
				<Image
					src="/icons/choki_icon.svg"
					alt="Choki Logo"
					width={120}
					height={120}
				/>
			</div>

			{/* Form Container */}
			<div className="w-full max-w-[316px] space-y-4">
				{/* Input Fields */}
				<div className="space-y-4">
					<CommonInput
						type="text"
						placeholder="아이디"
						value={id}
						onChange={e => setId(e.target.value)}
					/>
					<CommonInput
						type="password"
						placeholder="비밀번호"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>

				{/* Login Button */}
				<div className="pt-8">
					<CommonButton
						onClick={handleLogin}
						size="large"
						color="orange"
						text="로그인"
					></CommonButton>
				</div>
			</div>

			{/* Sign Up Link */}
			<button
				className="mt-4 text-gray-600 "
				onClick={() => {
					/* 회원가입 페이지로 이동 */
					router.push('./signup');
				}}
			>
				아이디가 없으신가요?
			</button>
		</div>
	);
}
