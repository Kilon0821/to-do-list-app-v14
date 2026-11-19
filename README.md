This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# To-Do List Application

## Data Structure

The application stores to-do items in a JSON file (`data/todos.json`). Each to-do item has the following structure:

```json
{
  "id": 1, // Unique identifier for the to-do item
  "title": "Basic Functionality", // Title of the to-do item
  "description": "Implement list, add, delete, edit, mark complete/incomplete, set due date, and multiple categories (Work, Personal, Urgent) selection.", // Description of the to-do item
  "status": "pending", // Status of the to-do item (e.g., pending, complete)
  "categories": ["Work"], // Categories associated with the to-do item
  "due_date": "2026-11-21", // Due date of the to-do item
  "completed_at": null, // Date and time when the to-do item was completed
  "created_at": "2023-10-01T14:00:00.000Z", // Date and time when the to-do item was created
  "modified_at": null, // Date and time when the to-do item was last modified
  "deleted_at": null // Date and time when the to-do item was deleted (if applicable)
}
```

### Parameters Explanation

- **id**: A unique identifier for each to-do item.
- **title**: The title of the to-do item.
- **description**: A detailed description of the to-do item.
- **status**: The status of the to-do item (e.g., pending, complete).
- **categories**: An array of categories associated with the to-do item.
- **due_date**: The due date of the to-do item in `YYYY-MM-DD` format.
- **completed_at**: The date and time when the to-do item was completed (if applicable).
- **created_at**: The date and time when the to-do item was created.
- **modified_at**: The date and time when the to-do item was last modified (if applicable).
- **deleted_at**: The date and time when the to-do item was deleted (if applicable).


# To-Do List Application

## Components

The following components are used to manage and display the to-do list items:

### AddTodo.js

- **Description**: Component to add new to-do items.
- **Usage**: Allows users to input new to-do items with title, description, and other details.

### EditTodo.js

- **Description**: Component to edit existing to-do items.
- **Usage**: Allows users to update the title, description, status, and other details of an existing to-do item.

### Filters.js

- **Description**: Component to apply filters to the to-do list.
- **Usage**: Provides options to filter tasks by status (pending, complete), categories, and due date.

### TodoItem.js

- **Description**: Component to display a single to-do item.
- **Usage**: Represents a single to-do item with its title, description, status, and other attributes.

### TodoList.js

- **Description**: Component to display the list of to-do items.
- **Usage**: Displays a list of all to-do items, and allows users to perform actions like adding, editing, and deleting items.