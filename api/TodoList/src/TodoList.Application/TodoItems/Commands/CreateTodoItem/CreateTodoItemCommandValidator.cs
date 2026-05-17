using FluentValidation;
using TodoList.Application.TodoItems.Commands.CreateTodoItem;

namespace TodoList.Application.TodoItems.Commands.CreateTodoItem;

public class CreateTodoItemCommandValidator : AbstractValidator<CreateTodoItemCommand>
{
    public CreateTodoItemCommandValidator()
    {
        RuleFor(v => v.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(25).WithMessage("Title is too long!");

        RuleFor(v => v.Description)
            .MaximumLength(1000).WithMessage("Description is too long!");
    }
}
