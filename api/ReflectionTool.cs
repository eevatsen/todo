using System;
using System.Linq;
using MediatR;

namespace ReflectionTool;

class Program
{
    static void Main()
    {
        var type = typeof(RequestHandlerDelegate<>);
        var method = type.GetMethod("Invoke");
        var parameters = method.GetParameters();
        Console.WriteLine($"Parameters count: {parameters.Length}");
        foreach (var p in parameters)
        {
            Console.WriteLine($"Param: {p.ParameterType.Name} {p.Name}");
        }
    }
}
