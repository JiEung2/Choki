import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface UserState {
	userId: number;
	username: string;
}

export const userAtom = atomWithStorage<UserState>('user', {
	userId: 0,
	username: '',
});

export const selectedChildIdAtom = atom<number | null>(null);
