using FluentAssertions;
using TodoList.Application.TodoItems.Commands.UpdateTodoItem;
using TodoList.Domain.Entities;
using TodoList.Domain.Enums;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class UpdateTodoItemCommandTests : TestBase
{
    [Fact]
    public async Task ShouldUpdateTodoItem()
    {
        // Arrange
        var id = Guid.NewGuid();
        Context.TodoItems.Add(new TodoItem { Id = id, Title = "Old Title" });
        await Context.SaveChangesAsync(CancellationToken.None);

        var handler = new UpdateTodoItemCommandHandler(Context);
        var command = new UpdateTodoItemCommand
        {
            Id = id,
            Title = "New Title",
            Status = TodoStatus.Done
        };

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        var entity = await Context.TodoItems.FindAsync(id);
        entity!.Title.Should().Be("New Title");
        entity.Status.Should().Be(TodoStatus.Done);
    }

    [Fact]
    public async Task ShouldThrowExceptionWhenNotFound()
    {
        // Arrange
        var handler = new UpdateTodoItemCommandHandler(Context);
        var command = new UpdateTodoItemCommand { Id = Guid.NewGuid(), Title = "New Title" };

        // Act & Assert
        await FluentActions.Invoking(() => handler.Handle(command, CancellationToken.None))
            .Should().ThrowAsync<Exception>();
    }
}
