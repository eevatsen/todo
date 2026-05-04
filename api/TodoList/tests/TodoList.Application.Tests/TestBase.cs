using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using TodoList.Application.Common.Mappings;
using TodoList.Infrastructure.Data;

namespace TodoList.Application.Tests;

public abstract class TestBase : IDisposable
{
    protected readonly AppDbContext Context;
    protected readonly IMapper Mapper;

    protected TestBase()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        Context = new AppDbContext(options);
        Context.Database.EnsureCreated();

        var configurationProvider = new MapperConfiguration(cfg =>
        {
            // Dummy license for tests if mandatory in v16
            // cfg.LicenseKey = "TEST-LICENSE"; 
            cfg.AddProfile<MappingProfile>();
        }, NullLoggerFactory.Instance);

        Mapper = configurationProvider.CreateMapper();
    }

    public void Dispose()
    {
        Context.Database.EnsureDeleted();
        Context.Dispose();
    }
}
