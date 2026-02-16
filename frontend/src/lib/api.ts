import { ApiError } from './api/errors';

// Gateway base URL - all requests go through the gateway
const GATEWAY_BASE_URL = 'http://localhost:3000/v1';

// Service-specific path prefixes
const SERVICE_PATHS = {
	auth: '/auth',
	blog: ''
} as const;

type Service = keyof typeof SERVICE_PATHS;

/**
 * Centralized API fetch wrapper
 * Routes all requests through the API gateway
 */
export async function apiFetch(service: Service, endpoint: string, options: RequestInit = {}) {
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	const servicePath = SERVICE_PATHS[service];
	const url = `${GATEWAY_BASE_URL}${servicePath}/${cleanEndpoint}`;

	const res = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		}
	});

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
