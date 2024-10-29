using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RasporedZvonjenja.Data;
using RasporedZvonjenja.Models;

namespace RasporedZvonjenja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RazredController : Controller
    {
        private readonly AppDbContext _context;

        public RazredController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Razred>>> GetRazredi()
        {
            return await _context.Razredi.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Razred>> GetRazred(int id)
        {
            var razred = await _context.Razredi.FindAsync(id);
            if (razred == null)
                return NotFound();
            return razred;
        }

        [HttpPost]
        public async Task<ActionResult<Razred>> PostRazred(Razred razred)
        {
            _context.Razredi.Add(razred);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRazred), new { id = razred.Id }, razred);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRazred(int id, Razred razred)
        {
            if (id != razred.Id)
                return BadRequest();

            _context.Entry(razred).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRazred(int id)
        {
            var razred = await _context.Razredi.FindAsync(id);
            if (razred == null)
                return NotFound();

            _context.Razredi.Remove(razred);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
