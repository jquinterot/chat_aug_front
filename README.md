This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## User API Documentation

The application uses a RESTful API for user management.

### `POST /register`

Create a new user.

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "a-strong-password"
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "username": "newuser",
  "email": "newuser@example.com"
}
```

---

### `GET /users`

List all users.

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "newuser",
    "email": "newuser@example.com"
  },
  {
    "id": 2,
    "username": "anotheruser",
    "email": "anotheruser@example.com"
  }
]
```

---

### `GET /users/{user_id}`

Get a single user by their ID.

**Success Response (200 OK):**
```json
{
  "id": 1,
  "username": "newuser",
  "email": "newuser@example.com"
}
```

---

### `DELETE /users/{user_id}`

Delete a user by their ID.

**Success Response (204 No Content):**

An empty response with a 204 status code indicates the user was successfully deleted.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
