using System.ComponentModel.DataAnnotations;

namespace RasporedZvonjenja.Models
{
    public class Raspored
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Datum { get; set; }

        [Required]
        public int UcenikId { get; set; }
        public Ucenik? Ucenik { get; set; }

        [Required]
        public int ProfesorId { get; set; }
        public Profesor? Profesor { get; set; }

        [Required]
        public bool IsJutarnjaSmjena { get; set; } // true for morning shift, false for afternoon
    }
}
