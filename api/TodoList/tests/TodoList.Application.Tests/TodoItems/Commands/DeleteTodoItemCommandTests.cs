using FluentAssertions;
using TodoList.Application.TodoItems.Commands.DeleteTodoItem;
using TodoList.Domain.Entities;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class DeleteTodoItemCommandTests : TestBase
{
    [Fact]
    public async Task ShouldDeleteTodoItem()
    {
        // Arrange
        var id = Guid.NewGuid();
        Context.TodoItems.Add(new TodoItem { Id = id, Title = "Task to Delete" });
        await Context.SaveChangesAsync(CancellationToken.None);

        var handler = new DeleteTodoItemCommandHandler(Context);

        // Act
        await handler.Handle(new DeleteTodoItemCommand(id), CancellationToken.None);

        // Assert
        var entity = await Context.TodoItems.FindAsync(id);
        entity.Should().BeNull();
    }
}
