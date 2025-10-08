
using Microsoft.OpenApi.Models;
using sql; // using SqlAzureConnector.cs
namespace VeilingPlatform;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddAuthorization(); // standaard (overbodig?)
        builder.Services.AddControllers();
        builder.Services.AddRouting();

        // Swagger Services, more at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c=>
        {
            c.SwaggerDoc("v1", new() { Title = "VeilingPlatform", Version = "v1" });
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c=>
            { 
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "VeilingPlatform v1");
            });
        }

        app.MapGet("/", context =>
        {
            context.Response.Redirect("/swagger");
            return Task.CompletedTask;
        });

        SqlAzureConnector.DoAQuery();

        app.UseHttpsRedirection();
        app.UseRouting();
        app.MapControllers();
        app.UseAuthorization();// standaard (niet in slides)

        app.Run();
    }
}
