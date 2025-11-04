// convex/todos.ts

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// --- REPLACE THIS FUNCTION ---
export const getTodos = query({
  args: {
    // We removed searchQuery, but we'll keep the filter!
    filter: v.optional(v.string()), // e.g., 'all', 'active', 'completed'
  },
  handler: async (ctx, args) => {
    let todosQuery = ctx.db.query('todos').order('desc');

    // Apply filter
    if (args.filter === 'active') {
      todosQuery = todosQuery.filter((q) =>
        q.eq(q.field('isCompleted'), false)
      );
    } else if (args.filter === 'completed') {
      todosQuery = todosQuery.filter((q) =>
        q.eq(q.field('isCompleted'), true)
      );
    }

    const todos = await todosQuery.collect();
    return todos;
  },
});
// --- END OF REPLACEMENT ---


// --- YOUR OTHER MUTATIONS (createTodo, updateTodo, deleteTodo) ---
// --- SHOULD BE DOWN HERE, UNCHANGED ---

// --- MUTATION ---
// A 'mutation' is a function to write or change data.
// This one will create a new todo item.
export const createTodo = mutation({
  // We define the arguments this function will take
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  // The 'handler' is the main logic
  handler: async (ctx, args) => {
    // 'ctx.db.insert' is how you create a new document
    const newTodoId = await ctx.db.insert('todos', {
      title: args.title,
      description: args.description,
      dueDate: args.dueDate,
      isCompleted: false, // New todos always start as not completed
    });

    return newTodoId;
  },
});

// convex/todos.ts
// (Add this code below your existing createTodo mutation)

// --- MUTATION: Update Todo ---
// Toggles the isCompleted flag of a todo
export const updateTodo = mutation({
  args: {
    id: v.id('todos'), // This validates it's a valid ID from the 'todos' table
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, isCompleted } = args;

    // 'ctx.db.patch' is how you update part of a document
    await ctx.db.patch(id, { isCompleted: isCompleted });
  },
});

// --- MUTATION: Delete Todo ---
export const deleteTodo = mutation({
  args: {
    id: v.id('todos'),
  },
  handler: async (ctx, args) => {
    // 'ctx.db.delete' is how you delete a document
    await ctx.db.delete(args.id);
  },
});

// convex/todos.ts (Add this new mutation)

// --- MUTATION: Clear Completed Todos ---
// Deletes all documents where isCompleted is true
export const clearCompletedTodos = mutation({
  handler: async (ctx) => {
    // Find all todos where isCompleted is true
    const completedTodos = await ctx.db
      .query('todos')
      .filter((q) => q.eq(q.field('isCompleted'), true))
      .collect();

    // Delete each one
    const deletePromises = completedTodos.map((todo) =>
      ctx.db.delete(todo._id)
    );

    // Wait for all deletions to finish
    await Promise.all(deletePromises);

    return { success: true, count: completedTodos.length };
  },
});

// convex/todos.ts (Add this new mutation)
