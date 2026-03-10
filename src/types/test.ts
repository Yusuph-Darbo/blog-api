export type UpdatePostInput = {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
};

export type UpdatePostResult =
  | { status: 400; error: string }
  | { status: 200; data: any }
  | { status: 404; error: string };

export type DeletePostResult =
  | { status: 200; data: string }
  | { status: 400; error: string }
  | { status: 404; error: string }
  | { status: 500; error: string };
