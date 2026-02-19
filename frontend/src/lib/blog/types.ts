export interface Article {
	id: string;
	authorId: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface Comment {
	id: string;
	articleId: string;
	authorId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface ArticleWithComments extends Article {
	comments: Comment[];
}
