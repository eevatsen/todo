using MediatR;
using Microsoft.EntityFrameworkCore;
using TodoList.Application.Common.Interfaces;

namespace TodoList.Application.TodoItems.Commands.DeleteTodoItem;

public record DeleteTodoItemCommand(Guid Id) : IRequest;

public class DeleteTodoItemCommandHandler : IRequestHandler<DeleteTodoItemCommand>
{
    private readonly IAppDbContext _context;

    public DeleteTodoItemCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteTodoItemCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.TodoItems
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"TodoItem {request.Id} not found.");
        }

        _context.TodoItems.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
