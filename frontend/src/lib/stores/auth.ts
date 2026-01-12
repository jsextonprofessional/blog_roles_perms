import type { User } from '$lib/types';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface AuthState {
	user: User | null;
	token: string | null;
}

const initialState: AuthState = {
	user: null,
	token: null
};

export const auth = writable<AuthState>(initialState);

export const login = (user: User, token: string) => {
	auth.set({ user, token });
};

export const logout = () => {
	auth.set({ user: null, token: null });
};

if (browser) {
	const storedAuth = localStorage.getItem('auth');
	if (storedAuth) {
		auth.set(JSON.parse(storedAuth));
	}

	auth.subscribe((value) => {
		localStorage.setItem('auth', JSON.stringify(value));
	});
}

// for future, can remove "if (browser)..." block, and create routes/api/me/+server.ts to fetch user info
// if (browser) {
// 	fetch('/api/me', { credentials: 'include' })
// 		.then((res) => (res.ok ? res.json() : { user: null }))
// 		.then((data) => auth.set({ user: data.user, token: null }))
// 		.catch(() => auth.set({ user: null, token: null }));
// }
