-- Drop tables
drop table if exists post;

create table post (
	post_id serial primary key,
	title text,
	slug text,
	content text,
	author text,
	category text,
	tags text[],
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp
);

-- Sample data
insert into post (title, slug, content, author, category, tags)
values
	(
	  'Getting Started with JavaScript',
	  'getting-started-with-javascript',
	  'JavaScript is the language of the web. In this guide, we break down the basics and show how to start coding.',
	  'Sarah Johnson',
	  'Technology',
	  array['JavaScript', 'Programming']
	),
	(
	  'Understanding REST APIs',
	  'understanding-rest-apis',
	  'REST APIs allow different software systems to communicate. Let’s explore how they work and why they matter.',
	  'Michael Lee',
	  'Backend',
	  array['API', 'HTTP', 'Web']
	),
	(
	  'Deploying a Node.js App to Render',
	  'deploy-node-app-render',
	  'Render makes Node.js deployment easy. This guide walks through creating a service, linking your repo, and deploying.',
	  'Liam Campbell',
	  'DevOps',
	  array['Node.js', 'Deployment', 'Cloud']
	);
