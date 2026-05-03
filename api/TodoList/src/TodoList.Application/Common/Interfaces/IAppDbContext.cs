using Microsoft.EntityFrameworkCore;
using TodoList.Domain.Entities;

namespace TodoList.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<TodoItem> TodoItems { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
