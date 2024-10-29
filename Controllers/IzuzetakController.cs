using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RasporedZvonjenja.Data;
using RasporedZvonjenja.Models;

namespace RasporedZvonjenja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IzuzetakController : Controller
    {
        private readonly AppDbContext _context;

        public IzuzetakController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Izuzetak>>> GetIzuzeci()
        {
            return await _context.Izuzeci.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Izuzetak>> GetIzuzetak(int id)
        {
            var izuzetak = await _context.Izuzeci.FindAsync(id);
            if (izuzetak == null)
                return NotFound();
            return izuzetak;
        }

        [HttpPost]
        public async Task<ActionResult<Izuzetak>> PostIzuzetak(Izuzetak izuzetak)
        {
            _context.Izuzeci.Add(izuzetak);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetIzuzetak), new { id = izuzetak.Id }, izuzetak);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutIzuzetak(int id, Izuzetak izuzetak)
        {
            if (id != izuzetak.Id)
                return BadRequest();

            _context.Entry(izuzetak).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIzuzetak(int id)
        {
            var izuzetak = await _context.Izuzeci.FindAsync(id);
            if (izuzetak == null)
                return NotFound();

            _context.Izuzeci.Remove(izuzetak);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
