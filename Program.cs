using Microsoft.EntityFrameworkCore;
using RasporedZvonjenja.Data;
using RasporedZvonjenja.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Configure Swagger/OpenAPI for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register AppDbContext with SQL Server (update connection string as needed)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register ScheduleService for dependency injection
builder.Services.AddScoped<ScheduleService>();

// Configure CORS if the frontend is hosted separately
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("CorsPolicy");

// Serve static files from wwwroot folder
app.UseStaticFiles();
app.UseDefaultFiles(); // Serve default files like index.html if available

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

// Fallback to index.html for any unmatched routes (for SPA)
app.MapFallbackToFile("index.html");

app.Run();
