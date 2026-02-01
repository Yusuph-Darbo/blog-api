# Blog API

A RESTful Blog API built with **Node.js**, **Express**, and **PostgreSQL**.  
This project allows users to create, read, update, and delete blog posts, each with a single category and multiple tags.

---

## Features

- Create blog posts
- Retrieve all posts
- Retrieve a post by ID
- Update existing posts
- Delete posts
- Single category per post
- Multiple tags per post (stored as a PostgreSQL array)

---

## Tech Stack

- **Node.js**
- **Express**
- **PostgreSQL**
- **DBeaver**
- **Insomnia** for API testing

---

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v14+ recommended)
- **npm** or **yarn**
- **PostgreSQL** (running and accessible)

---

## Setup

1. **Clone the repository**
   git clone https://github.com/Yusuph-Darbo/blog-api.git
   cd blog-api

2. Install dependencies

   npm install

   or

   yarn

3. Create a `.env` file
   Copy `.env.example` to `.env` and set your database connection and other environment variables:

   PORT=3000
   DATABASE_URL=postgres://user:password@localhost:5432/blogdb

4. Set up the database
   Run database migrations if you’re using a migration tool (Sequelize, Knex, etc.).
   Otherwise, ensure your database schema is created manually.

5. Start the server

   npm start

   or

   yarn start

6. The API should now be running at:
   `http://localhost:<PORT>` (default: 3000)

   API Endpoints

| Method | Endpoint   | Description           |
| ------ | ---------- | --------------------- |
| GET    | /posts     | Retrieve all posts    |
| GET    | /posts/:id | Retrieve a post by ID |
| POST   | /posts     | Create a new post     |
| PUT    | /posts/:id | Update a post by ID   |
| DELETE | /posts/:id | Delete a post by ID   |
