using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RasporedZvonjenja.Data;
using RasporedZvonjenja.Models;

namespace RasporedZvonjenja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UcenikController : Controller
    {
        private readonly AppDbContext _context;

        public UcenikController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ucenik>>> GetUcenici()
        {
            return await _context.Ucenici.Include(u => u.Razred).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Ucenik>> GetUcenik(int id)
        {
            var ucenik = await _context.Ucenici.Include(u => u.Razred).FirstOrDefaultAsync(u => u.Id == id);
            if (ucenik == null)
                return NotFound();
            return ucenik;
        }

        [HttpPost]
        public async Task<ActionResult<Ucenik>> PostUcenik(Ucenik ucenik)
        {
            _context.Ucenici.Add(ucenik);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUcenik), new { id = ucenik.Id }, ucenik);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUcenik(int id, Ucenik ucenik)
        {
            if (id != ucenik.Id)
                return BadRequest();

            _context.Entry(ucenik).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUcenik(int id)
        {
            var ucenik = await _context.Ucenici.FindAsync(id);
            if (ucenik == null)
                return NotFound();

            _context.Ucenici.Remove(ucenik);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
