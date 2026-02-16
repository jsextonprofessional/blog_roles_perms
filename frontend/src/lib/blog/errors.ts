export class BlogError extends Error {
	constructor(
		message: string,
		public code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION' | 'NETWORK' | 'UNKNOWN'
	) {
		super(message);
		this.name = 'BlogError';
	}
}
