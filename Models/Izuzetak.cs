using System.ComponentModel.DataAnnotations;

namespace RasporedZvonjenja.Models
{
    public class Izuzetak
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Datum { get; set; } // Date excluded from the schedule
    }
}
