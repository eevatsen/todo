using AutoMapper;
using TodoList.Application.Common.Models;
using TodoList.Domain.Entities;

namespace TodoList.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<TodoItem, TodoItemDto>();
    }
}
