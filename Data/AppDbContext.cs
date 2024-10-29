using Microsoft.EntityFrameworkCore;
using RasporedZvonjenja.Models;
using System.Collections.Generic;

namespace RasporedZvonjenja.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Razred> Razredi { get; set; }
        public DbSet<Ucenik> Ucenici { get; set; }
        public DbSet<Profesor> Profesori { get; set; }
        public DbSet<Izuzetak> Izuzeci { get; set; }
        public DbSet<Raspored> Rasporedi { get; set; }
    }
}
