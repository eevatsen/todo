import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface TodoItem {
    id: string;
    title: string;
    description?: string;
    status: TodoStatus;
    deadline?: string;
    createdAt: string;
}

export const TodoStatus = {
    Todo: 0,
    InProgress: 1,
    Done: 2
} as const;

export type TodoStatus = typeof TodoStatus[keyof typeof TodoStatus];

export const todoApi = createApi({
    reducerPath: 'todoApi',
    // for now
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }), 
    
    tagTypes: ['Todo'],

    endpoints: (builder) => ({
        // GET all tasks
        getTodos: builder.query<TodoItem[], void>({
            query: () => 'todo',
            providesTags: ['Todo'],
        }),

        // POST
        createTodo: builder.mutation<string, Partial<TodoItem>>({
            query: (todo) => ({
                url: 'todo',
                method: 'POST',
                body: todo,
            }),
            invalidatesTags: ['Todo'],
        }),

        // PUT
        updateTodo: builder.mutation<void, TodoItem>({
            query: (todo) => ({
                url: `todo/${todo.id}`,
                method: 'PUT',
                body: todo,
            }),
            invalidatesTags: ['Todo'],
        }),

        // DELETE
        deleteTodo: builder.mutation<void, string>({
            query: (id) => ({
                url: `todo/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Todo'],
        }),
    }),
});

export const {
    useGetTodosQuery,
    useCreateTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
} = todoApi;
