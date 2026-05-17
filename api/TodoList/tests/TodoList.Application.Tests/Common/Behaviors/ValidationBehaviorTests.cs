using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Moq;
using FluentAssertions;
using TodoList.Application.Common.Behaviors;

namespace TodoList.Application.Tests.Common.Behaviors;

public class ValidationBehaviorTests
{
    [Fact]
    public async Task Handle_WithValidRequest_ShouldCallNext()
    {
        // Arrange
        var request = new TestRequest();
        bool nextCalled = false;
        Task<string> Next() 
        {
            nextCalled = true;
            return Task.FromResult("Success");
        }

        var validator = new TestRequestValidator(true);
        var behavior = new ValidationBehavior<TestRequest, string>(new[] { validator });

        // Act
        var result = await behavior.Handle(request, new RequestHandlerDelegate<string>(Next), default);

        // Assert
        result.Should().Be("Success");
        nextCalled.Should().BeTrue();
    }

    [Fact]
    public async Task Handle_WithInvalidRequest_ShouldThrowValidationException()
    {
        // Arrange
        var request = new TestRequest();
        Task<string> Next() => Task.FromResult("Success");
        
        var validator = new TestRequestValidator(false);
        var behavior = new ValidationBehavior<TestRequest, string>(new[] { validator });

        // Act & Assert
        await FluentActions.Invoking(() => behavior.Handle(request, new RequestHandlerDelegate<string>(Next), default))
            .Should().ThrowAsync<ValidationException>();
    }

    public class TestRequest : IRequest<string> { }

    public class TestRequestValidator : AbstractValidator<TestRequest>
    {
        public TestRequestValidator(bool valid)
        {
            if (!valid)
            {
                RuleFor(x => x).Custom((x, context) => context.AddFailure("Error"));
            }
        }
    }
}
