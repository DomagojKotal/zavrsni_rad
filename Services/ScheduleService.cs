using Microsoft.EntityFrameworkCore;
using RasporedZvonjenja.Data;
using RasporedZvonjenja.Models;
using System;

namespace RasporedZvonjenja.Services
{
    public class ScheduleService
    {
        private readonly AppDbContext _context;

        public ScheduleService(AppDbContext context)
        {
            _context = context;
        }

        public void GenerateSchedule()
        {
            var students = _context.Ucenici.Include(u => u.Razred).ToList();
            var professors = _context.Profesori.ToList();
            var excludedDates = _context.Izuzeci.Select(i => i.Datum).ToHashSet();

            DateTime startDate = new DateTime(2024, 9, 1); 
            DateTime endDate = new DateTime(2025, 6, 30);  

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                if (excludedDates.Contains(date) || date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                    continue;

                AssignDutyForDay(date, students, professors);
            }

            _context.SaveChanges();
        }

        private void AssignDutyForDay(DateTime date, List<Ucenik> students, List<Profesor> professors)
        {
            // Morning shift
            var morningStudents = GetShiftStudents(students, date, isMorningShift: true);
            var morningProfessor = GetProfessorForDay(professors, date, isMorningShift: true);

            foreach (var student in morningStudents)
            {
                var scheduleEntry = new Raspored
                {
                    Datum = date,
                    UcenikId = student.Id,
                    ProfesorId = morningProfessor.Id,
                    IsJutarnjaSmjena = true
                };
                _context.Rasporedi.Add(scheduleEntry);
            }


            // Afternoon shift
            var afternoonStudents = GetShiftStudents(students, date, isMorningShift: false);
            var afternoonProfessor = GetProfessorForDay(professors, date, isMorningShift: false);

            foreach (var student in afternoonStudents)
            {
                var scheduleEntry = new Raspored
                {
                    Datum = date,
                    UcenikId = student.Id,
                    ProfesorId = afternoonProfessor.Id,
                    IsJutarnjaSmjena = false
                };
                _context.Rasporedi.Add(scheduleEntry);
            }
        }

        private List<Ucenik> GetShiftStudents(List<Ucenik> students, DateTime date, bool isMorningShift)
        {
            return students
                .Where(s => ((s.Id + date.DayOfYear) % 2 == (isMorningShift ? 0 : 1)))
                .ToList();
        }

        private Profesor GetProfessorForDay(List<Profesor> professors, DateTime date, bool isMorningShift)
        {
            int shiftOffset = isMorningShift ? 0 : 1;
            int professorIndex = (date.DayOfYear + shiftOffset) % professors.Count;
            return professors[professorIndex];
        }

        public void RefreshScheduleOnChanges()
        {
            _context.Rasporedi.RemoveRange(_context.Rasporedi);
            GenerateSchedule();
        }

        public void SwapShiftsWeekly()
        {
            var allShifts = _context.Rasporedi.ToList();

            foreach (var entry in allShifts)
            {
                entry.IsJutarnjaSmjena = entry.IsJutarnjaSmjena == true ? false : true;
            }

            _context.SaveChanges();
        }

        public IEnumerable<Raspored> GetScheduleForDate(DateTime date)
        {
            return _context.Rasporedi
                .Where(r => r.Datum == date && !_context.Izuzeci.Any(e => e.Datum == date))
                .Include(r => r.Ucenik).ThenInclude(u => u.Razred)
                .Include(r => r.Profesor)
                .ToList();
        }
    }
}