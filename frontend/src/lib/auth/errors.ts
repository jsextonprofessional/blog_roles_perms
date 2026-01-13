export class AuthError extends Error {
	code: 'INVALID_CREDENTIALS' | 'NETWORK' | 'UNKNOWN';

	constructor(message: string, code: AuthError['code'] = 'UNKNOWN') {
		super(message);
		this.code = code;
	}
}
