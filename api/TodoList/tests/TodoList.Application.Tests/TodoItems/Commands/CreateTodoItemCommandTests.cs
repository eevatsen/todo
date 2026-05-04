using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TodoList.Application.TodoItems.Commands.CreateTodoItem;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class CreateTodoItemCommandTests : TestBase
{
    [Fact]
    public async Task ShouldCreateTodoItem()
    {
        // Arrange
        var handler = new CreateTodoItemCommandHandler(Context);
        var command = new CreateTodoItemCommand
        {
            Title = "New Task",
            Description = "Description",
            Deadline = DateTime.UtcNow.AddDays(1)
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        var entity = await Context.TodoItems.FindAsync(result);
        entity.Should().NotBeNull();
        entity!.Title.Should().Be(command.Title);
        entity.Description.Should().Be(command.Description);
        entity.Deadline.Should().Be(command.Deadline);
    }
}
