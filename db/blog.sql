-- Drop tables
drop table if exists post_tags, tags, post, category;

create table category (
	category_id serial primary key,
	name text unique,
	slug text unique
);

create table post (
	post_id serial primary key,
	title text,
	content text,
	category_id int references category(category_id),
	created_at timestamp,
	updated_at timestamp
);

create table tags (
	tag_id serial primary key,
	name text unique,
	slug text unique
);

-- Junction table as a post can have multiple tags, and a tag can belong to many posts
create table post_tags (
	post_id int references post(post_id) not null,
	tag_id int references tags(tag_id) not null,
	unique(post_id, tag_id)
);