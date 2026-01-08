import type { BlogPost, Comment } from './types';

export const blogPosts: BlogPost[] = [
	{
		id: '1',
		authorId: 'a1',
		title: 'First Post',
		body: 'This is the body of the first post.',
		createdAt: new Date('2024-01-01T10:00:00Z'),
		updatedAt: new Date('2024-01-01T10:00:00Z')
	},
	{
		id: '2',
		authorId: 'a2',
		title: 'Second Post',
		body: 'This is the body of the second post.',
		createdAt: new Date('2024-02-01T11:00:00Z'),
		updatedAt: new Date('2024-02-01T11:00:00Z')
	},
	{
		id: '3',
		authorId: 'a1',
		title: 'Third Post',
		body: 'This is the body of the third post.',
		createdAt: new Date('2024-03-01T12:00:00Z'),
		updatedAt: new Date('2024-03-01T12:00:00Z')
	}
];

export const comments: Comment[] = [
	{
		id: 'c1',
		postId: '1',
		authorId: 'u1',
		body: 'This is comment 1 on post 1.',
		createdAt: new Date('2024-01-02T10:00:00Z'),
		updatedAt: new Date('2024-01-02T10:00:00Z')
	},
	{
		id: 'c2',
		postId: '1',
		authorId: 'u2',
		body: 'This is comment 2 on post 1.',
		createdAt: new Date('2024-01-03T11:00:00Z'),
		updatedAt: new Date('2024-01-03T11:00:00Z')
	},
	{
		id: 'c3',
		postId: '2',
		authorId: 'u1',
		body: 'This is comment 1 on post 2.',
		createdAt: new Date('2024-02-02T12:00:00Z'),
		updatedAt: new Date('2024-02-02T12:00:00Z')
	}
];
