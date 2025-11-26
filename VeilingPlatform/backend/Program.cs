using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;
using DotNetEnv;
using VeilingPlatform.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace VeilingPlatform;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // .env file vanuit Root
        Env.Load(".env"); // laadt de algemene instellingen
        Env.Load(".env.local");

        var server = Env.GetString("DB_SERVER");
        var database = Env.GetString("DB_NAME");
        var user = Env.GetString("DB_USER");
        var password = Env.GetString("DB_PASSWORD");
        var trustCert = Env.GetString("TRUST_CERT", "True");

        var connectionString =
           $"Server={server};Database={database};User Id={user};Password={password};TrustServerCertificate={trustCert};";

        // Dbcontext verbinding
        builder.Services.AddDbContext<DbConnect>(options =>
            options.UseSqlServer(connectionString));

             // Add Identity
        builder.Services.AddIdentity<User, IdentityRole<int>>()
            .AddEntityFrameworkStores<DbConnect>()
            .AddDefaultTokenProviders();

        // JWT Authentication
        var jwtKey = builder.Configuration["Jwt:Key"];
        var jwtIssuer = builder.Configuration["Jwt:Issuer"];

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                ClockSkew = TimeSpan.Zero
            };
        });

        // Container service
        builder.Services.AddAuthorization();
        builder.Services.AddControllers();
        builder.Services.AddRouting();

        // Swagger
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new() { Title = "VeilingPlatform", Version = "v1" });
        });

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin();
            });
        });

        var app = builder.Build();

        // Swagger UI
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "VeilingPlatform v1");
            });
        }

        app.MapGet("/", context =>
        {
            context.Response.Redirect("/swagger");
            return Task.CompletedTask;
        });

        app.UseCors("AllowReactApp");
        app.UseHttpsRedirection();
        app.UseRouting();
        app.MapControllers();
        app.UseAuthorization();
        app.UseStaticFiles();
        app.Run();
    }
}
