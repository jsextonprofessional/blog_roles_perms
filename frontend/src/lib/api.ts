import { ApiError } from './api/errors';

const API_BASE = import.meta.env.DEV ? '/api' : 'http://localhost:3000/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	const res = await fetch(`${API_BASE}/${cleanEndpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		}
	});

	// original error handling
	// if (!res.ok) {

	// 	const error = await res.json().catch(() => ({}));
	// 	throw new Error(error.error || 'API request failed');
	// }

	let data;
	try {
		data = await res.json();
	} catch {
		data = null;
	}

	if (!res.ok) {
		throw new ApiError(data?.error ?? data?.message ?? 'Request failed', res.status);
	}

	return data;
}
