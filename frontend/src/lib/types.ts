export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	permissionLevel: 'READER' | 'WRITER' | 'EDITOR';
}

export interface BlogPost {
	id: string;
	authorId: string;
	title: string;
	body: string;
	createdAt: Date;
	updatedAt: Date;
	comments?: Comment[];
}

export interface Comment {
	id: string;
	postId: string;
	authorId: string;
	body: string;
	createdAt: Date;
	updatedAt: Date;
}
