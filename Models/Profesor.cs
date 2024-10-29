using System.ComponentModel.DataAnnotations;

namespace RasporedZvonjenja.Models
{
    public class Profesor
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Ime { get; set; }

        [Required]
        public string Prezime { get; set; }

        [Required]
        public string Predmet { get; set; }
    }
}
