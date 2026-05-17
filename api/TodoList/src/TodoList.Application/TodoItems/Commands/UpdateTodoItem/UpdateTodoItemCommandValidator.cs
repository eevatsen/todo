using FluentValidation;
using TodoList.Application.TodoItems.Commands.UpdateTodoItem;

namespace TodoList.Application.TodoItems.Commands.UpdateTodoItem;

public class UpdateTodoItemCommandValidator : AbstractValidator<UpdateTodoItemCommand>
{
    public UpdateTodoItemCommandValidator()
    {
        RuleFor(v => v.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(25).WithMessage("Title is too long!");

        RuleFor(v => v.Description)
            .MaximumLength(1000).WithMessage("Description is too long!");
    }
}
