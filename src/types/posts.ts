export interface posts {
  post_id: number;
  title: string;
  slug: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface postUpdated {
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
}
