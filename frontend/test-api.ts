// frontend/test-api.ts
import { apiFetch } from './src/lib/api';

// Test login
async function testLogin() {
	try {
		const data = await apiFetch('auth', '/login', {
			method: 'POST',
			body: JSON.stringify({
				email: 'admin@example.com',
				password: 'supersecret'
			})
		});

		console.log('✅ Login successful!');
		console.log('User:', data.user);
		console.log('Token:', data.token.substring(0, 50) + '...');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error('❌ Login failed:', error.message);
	}
}

// Test health (public endpoint)
async function testHealth() {
	try {
		const data = await apiFetch('auth', '/health');
		console.log('✅ Health check:', data);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error('❌ Health failed:', error.message);
	}
}

// Run tests
(async () => {
	console.log('Testing api.ts...\n');
	await testHealth();
	await testLogin();
})();
