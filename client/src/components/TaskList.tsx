import { useGetTodosQuery, useDeleteTodoMutation, useUpdateTodoMutation } from "../store/api/todoApi";

const TaskList = () => {
    const {data: todos, isLoading, isError } = useGetTodosQuery();

    const [deleteTodo] = useDeleteTodoMutation();
    const [updateTodo] = useUpdateTodoMutation();

    if (isLoading) return <div>Loading your tasks...</div>;
    if (isError) return <div>Something went wrong :C</div>;
    if (!todos || todos.length === 0) return <div>You do not have any tasks yet!</div>;

    return (
        /* to be implemented */
        null
    );
}