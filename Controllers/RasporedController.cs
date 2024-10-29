using Microsoft.AspNetCore.Mvc;
using RasporedZvonjenja.Services;

namespace RasporedZvonjenja.Controllers
{
    /// <summary>
    /// Controller for managing and retrieving duty schedules.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class RasporedController : Controller
    {
        private readonly ScheduleService _scheduleService;

        public RasporedController(ScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        /// <summary>
        /// Generates or refreshes the schedule.
        /// </summary>
        [HttpPost("generate")]
        public IActionResult GenerateSchedule()
        {
            _scheduleService.GenerateSchedule();
            return Ok("Schedule generated successfully.");
        }

        /// <summary>
        /// Retrieves the schedule for a specific date.
        /// </summary>
        /// <param name="date">The date for which to retrieve the schedule.</param>
        /// <returns>List of duty assignments for the specified date.</returns>
        [HttpGet]
        public IActionResult GetScheduleForDate([FromQuery] string date)
        {
            if (string.IsNullOrEmpty(date))
            {
                return BadRequest("Date parameter is required.");
            }

            if (!DateTime.TryParse(date, null, System.Globalization.DateTimeStyles.RoundtripKind, out DateTime scheduleDate))
            {
                return BadRequest("Invalid date format. Please use ISO date format (e.g., 2024-10-28T00:00:00Z).");
            }

            var schedule = _scheduleService.GetScheduleForDate(scheduleDate.Date);
            return Ok(schedule);
        }

        /// <summary>
        /// Refreshes the schedule based on changes (e.g., added/removed students or professors).
        /// </summary>
        [HttpPost("refresh")]
        public IActionResult RefreshSchedule()
        {
            _scheduleService.RefreshScheduleOnChanges();
            return Ok("Schedule refreshed successfully.");
        }

        /// <summary>
        /// Swaps morning and afternoon shifts for the next week.
        /// </summary>
        [HttpPost("swap-shifts")]
        public IActionResult SwapShifts()
        {
            _scheduleService.SwapShiftsWeekly();
            return Ok("Shifts swapped successfully for the next week.");
        }
    }
}
