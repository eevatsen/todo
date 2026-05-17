using FluentValidation.TestHelper;
using TodoList.Application.TodoItems.Commands.CreateTodoItem;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class CreateTodoItemCommandValidatorTests
{
    private readonly CreateTodoItemCommandValidator _validator;

    public CreateTodoItemCommandValidatorTests()
    {
        _validator = new CreateTodoItemCommandValidator();
    }

    [Fact]
    public void Should_Have_Error_When_Title_Is_Empty()
    {
        var command = new CreateTodoItemCommand { Title = string.Empty };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Should_Have_Error_When_Title_Exceeds_Max_Length()
    {
        var command = new CreateTodoItemCommand { Title = new string('a', 201) };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Command_Is_Valid()
    {
        var command = new CreateTodoItemCommand { Title = "Valid Title" };
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }
}
