import { apiFetch } from '$lib/api';
import { ApiError } from '$lib/api/errors';
import { login as setAuth } from '$lib/stores/auth';
import { AuthError } from './errors';

export async function registerUser(
	firstName: string,
	lastName: string,
	email: string,
	password: string
) {
	try {
		await apiFetch('auth', '/register', {
			method: 'POST',
			body: JSON.stringify({ firstName, lastName, email, password })
		});
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			if (error.status === 400) {
				throw new AuthError('Email is already in use', 'INVALID_CREDENTIALS');
			}

			throw new AuthError('Registration failed due to a server error', 'UNKNOWN');
		}
		throw new AuthError('Network error, please check your connection and try again.', 'NETWORK');
	}
}

export async function loginWithEmail(email: string, password: string) {
	try {
		const data = await apiFetch('auth', '/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});

		setAuth(data.user, data.token);

		return data;
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			if (error.status === 401) {
				throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
			}

			throw new AuthError('Login failed due to a server error', 'UNKNOWN');
		}

		throw new AuthError('Network error, please check your connection and try again.', 'NETWORK');
	}
}
