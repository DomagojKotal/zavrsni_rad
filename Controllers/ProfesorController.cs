using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RasporedZvonjenja.Data;
using RasporedZvonjenja.Models;

namespace RasporedZvonjenja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfesorController : Controller
    {
        private readonly AppDbContext _context;

        public ProfesorController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Profesor>>> GetProfesori()
        {
            return await _context.Profesori.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Profesor>> GetProfesor(int id)
        {
            var profesor = await _context.Profesori.FindAsync(id);
            if (profesor == null)
                return NotFound();
            return profesor;
        }

        [HttpPost]
        public async Task<ActionResult<Profesor>> PostProfesor(Profesor profesor)
        {
            _context.Profesori.Add(profesor);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProfesor), new { id = profesor.Id }, profesor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProfesor(int id, Profesor profesor)
        {
            if (id != profesor.Id)
                return BadRequest();

            _context.Entry(profesor).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfesor(int id)
        {
            var profesor = await _context.Profesori.FindAsync(id);
            if (profesor == null)
                return NotFound();

            _context.Profesori.Remove(profesor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
