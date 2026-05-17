using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TodoList.Application.TodoItems.Commands.CreateTodoItem;
using TodoList.Domain.Enums;

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
            Deadline = DateTime.UtcNow.AddDays(1),
            Priority = TodoPriority.High
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        var entity = await Context.TodoItems.FindAsync(result);
        entity.Should().NotBeNull();
        entity!.Title.Should().Be(command.Title);
        entity.Description.Should().Be(command.Description);
        entity.Deadline.Should().Be(command.Deadline);
        entity.Priority.Should().Be(command.Priority);
    }
}
