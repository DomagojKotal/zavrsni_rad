using System.ComponentModel.DataAnnotations;

namespace RasporedZvonjenja.Models
{
    public class Ucenik
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Ime { get; set; }

        [Required]
        public string Prezime { get; set; }

        [Required]
        public int RazredId { get; set; }
        public Razred? Razred { get; set; }
    }
}
