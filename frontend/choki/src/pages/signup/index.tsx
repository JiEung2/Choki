import { useState, useCallback } from 'react';
import CommonButton from '@/components/Common/Button';
import CommonInput from '@/components/Common/Input';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AddressSearch from '@/components/AddressSearch/AddressSearch';
import { registerUser } from '@/lib/api/login';

export default function SignupPage() {
	const [id, setId] = useState<string>('');
	const [passwordForm, setPasswordForm] = useState<PasswordForm>({
		password: '',
		passwordConfirm: '',
		isMatch: true,
		message: '',
	});
	const [isParent, setIsParent] = useState<boolean>(true);
	const [nickname, setNickname] = useState<string>('');
	const [phone, setPhone] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const Router = useRouter();
	const [isAddressSearchOpen, setIsAddressSearchOpen] =
		useState<boolean>(false);
	const [location, setLocation] = useState<{
		latitude?: number;
		longitude?: number;
	}>({});

	const postUserData = async (
		userId: string,
		userPassword: string,
		nickname: string,
		address: string,
		latitude: number | undefined,
		longitude: number | undefined,
		name: string,
		tel: string,
		role: 'PARENT' | 'CHILD',
	) => {
		// latitude와 longitude가 undefined일 경우 0으로 대체
		const safeLatitude = latitude ?? 0;
		const safeLongitude = longitude ?? 0;
		try {
			const response = await registerUser({
				userId,
				userPassword,
				nickname,
				address,
				latitude: safeLatitude,
				longitude: safeLongitude,
				name,
				tel,
				role,
			});
			return response;
		} catch (error) {
			console.error('Error registering user:', error);
			throw error;
		}
	};

	const handleAddressSearch = useCallback(() => {
		setIsAddressSearchOpen(true);
	}, []);

	const handleAddress = useCallback((data: AddressData) => {
		setAddress(data.address);
		if (data.latitude && data.longitude) {
			setLocation({
				latitude: data.latitude,
				longitude: data.longitude,
			});
		}
		setIsAddressSearchOpen(false);
	}, []);

	const handleSignup = async () => {
		try {
			await postUserData(
				id,
				passwordForm.password,
				nickname,
				address,
				location.latitude,
				location.longitude,
				name,
				phone,
				isParent ? 'PARENT' : 'CHILD',
			);
			Router.push({
				pathname: '/signup/done',
				query: { isParent },
			});
		} catch (error) {
			console.error('회원가입에 실패했습니다:', error);
		}
	};

	const handlePasswordChange =
		(field: 'password' | 'passwordConfirm') =>
		(e: React.ChangeEvent<HTMLInputElement>): void => {
			const { value } = e.target;

			setPasswordForm(prev => {
				const newForm = { ...prev, [field]: value };

				if (newForm.passwordConfirm !== '') {
					const isMatch = newForm.password === newForm.passwordConfirm;
					return {
						...newForm,
						isMatch,
						message: isMatch ? '' : '비밀번호가 일치하지 않습니다.',
					};
				}
				return newForm;
			});
		};

	return (
		<div className="bg-light_yellow_mid flex flex-col items-center h-screen px-4 py-6 gap-5">
			<div className="flex items-center justify-center w-full relative mb-8">
				<div
					className="w-6 h-6 cursor-pointer absolute left-0"
					onClick={() => window.history.back()}
				>
					<Image
						src="/icons/back_icon.svg"
						alt="Back Icon"
						width={24}
						height={24}
					/>
				</div>
				<h1 className="text-2xl font-bold">회원가입</h1>
			</div>

			<CommonInput
				type="text"
				placeholder="아이디"
				value={id}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setId(e.target.value)
				}
			/>

			<div className="relative">
				<CommonInput
					type="password"
					placeholder="비밀번호"
					value={passwordForm.password}
					onChange={handlePasswordChange('password')}
				/>
			</div>

			<div className="relative">
				<CommonInput
					type="password"
					placeholder="비밀번호 확인"
					value={passwordForm.passwordConfirm}
					onChange={handlePasswordChange('passwordConfirm')}
				/>
			</div>

			<div className="flex w-[315px]">
				<button
					onClick={() => setIsParent(true)}
					className={`flex-1 py-2 rounded-l-full ${
						isParent ? 'bg-orange_main text-white' : 'bg-white'
					}`}
				>
					부모
				</button>
				<button
					onClick={() => setIsParent(false)}
					className={`flex-1 py-2 rounded-r-full ${
						!isParent ? 'bg-orange_main  text-white' : 'bg-white'
					}`}
				>
					자녀
				</button>
			</div>

			<CommonInput
				type="text"
				placeholder="닉네임"
				value={nickname}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setNickname(e.target.value)
				}
			/>
			<CommonInput
				type="text"
				placeholder="이름"
				value={name}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setName(e.target.value)
				}
			/>

			<div className="w-full max-w-[315px] space-y-2">
				<div className="relative">
					<CommonInput
						type="text"
						placeholder="주소"
						value={address}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setAddress(e.target.value)
						}
					/>
					<div
						className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
						onClick={handleAddressSearch}
					>
						<Image
							src="/icons/search_icon.png"
							alt="Search Icon"
							width={24}
							height={24}
							className="w-6 h-6"
						/>
					</div>
				</div>
			</div>

			<CommonInput
				type="text"
				placeholder="전화번호"
				value={phone}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setPhone(e.target.value)
				}
			/>
			<div className="mt-8">
				<CommonButton
					color="orange"
					size="large"
					text="가입하기"
					onClick={handleSignup}
				/>
			</div>

			{isAddressSearchOpen && (
				<AddressSearch
					onComplete={handleAddress}
					onClose={() => {
						setIsAddressSearchOpen(false);
					}}
				/>
			)}
		</div>
	);
}
