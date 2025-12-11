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
	slug text,
	content text,
	author text,
	category_id int references category(category_id),
	created_at timestamp default current_timestamp
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


-- Sample data
INSERT INTO post (title, slug, content, author) VALUES
(
  'Getting Started with JavaScript',
  'getting-started-with-javascript',
  'JavaScript is the language of the web. In this guide, we break down the basics and show how to start coding.',
  'Sarah Johnson'
),
(
  'Understanding REST APIs',
  'understanding-rest-apis',
  'REST APIs allow different software systems to communicate. Let’s explore how they work and why they matter.',
  'Michael Lee'
),
(
  'Deploying a Node.js App to Render',
  'deploy-node-app-render',
  'Render makes Node.js deployment easy. This guide walks through creating a service, linking your repo, and deploying.',
  'Liam Campbell'
);
