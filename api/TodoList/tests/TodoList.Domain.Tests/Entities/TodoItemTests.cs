using FluentAssertions;
using TodoList.Domain.Entities;
using TodoList.Domain.Enums;

namespace TodoList.Domain.Tests.Entities;

public class TodoItemTests
{
    [Fact]
    public void ShouldSetDefaultValues()
    {
        // Act
        var item = new TodoItem();

        // Assert
        item.Status.Should().Be(TodoStatus.Todo);
        item.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }
}
