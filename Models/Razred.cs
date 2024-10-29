using System.ComponentModel.DataAnnotations;

namespace RasporedZvonjenja.Models
{
    public class Razred
    {
        [Key]
        public int Id { get; set; }

        [Required] 
        public string Name { get; set; }

        [Required]
        public string Oznaka { get; set; } 
    }
}
