using FluentAssertions;
using TodoList.Application.TodoItems.Queries;
using TodoList.Domain.Entities;

namespace TodoList.Application.Tests.TodoItems.Queries;

public class GetTodoItemsQueryTests : TestBase
{
    [Fact]
    public async Task ShouldReturnTodoItems()
    {
        // Arrange
        var handler = new GetTodoItemsQueryHandler(Context, Mapper);
        Context.TodoItems.Add(new TodoItem { Id = Guid.NewGuid(), Title = "Task 1" });
        Context.TodoItems.Add(new TodoItem { Id = Guid.NewGuid(), Title = "Task 2" });
        await Context.SaveChangesAsync(CancellationToken.None);

        // Act
        var result = await handler.Handle(new GetTodoItemsQuery(), CancellationToken.None);

        // Assert
        result.Should().HaveCount(2);
        result[0].Title.Should().Be("Task 1");
    }
}
