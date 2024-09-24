using EmployeeCrudApi.Data;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using EmployeeCrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmployeeCrudApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private ApplicationDbContext _context;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Employee>> GetAll()
        {
            return await _context.Employees.ToListAsync();
        }

        [HttpGet]
        public async Task<Employee> GetById(int id)
        {
            return await _context.Employees.FindAsync(id);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Employee employee)
        {
            if (employee.Name.Length > 100)
            {
                return BadRequest("El nombre debe tener menos de 100 caracteres.");
            }
            
            if (employee.Name.Length < 2)
            {
                return BadRequest("El nombre debe tener más de un caracter.");
            }

            if (Regex.IsMatch(employee.Name, @"\d"))
            {
                return BadRequest("El nombre no puede contener números.");
            }

            var parts = employee.Name.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            foreach (var part in parts)
            {
                if (part.Length < 2)
                {
                    return BadRequest("Cada parte del nombre debe tener más de un caracter.");
                }
            }

            if (string.IsNullOrWhiteSpace(employee.Name))
            {
                return BadRequest("No puede haber palabras vacías o solo compuestas por espacios.");
            }   

            employee.CreatedDate = DateTime.Now;
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();

            return Ok(employee);
        }

        [HttpPut]
        public async Task Update([FromBody] Employee employee)
        {
            Employee employeeToUpdate = await _context.Employees.FindAsync(employee.Id);
            employeeToUpdate.Name = employee.Name;
            await _context.SaveChangesAsync();
        }

        [HttpDelete]
        public async Task Delete(int id)
        {
            var employeeToDelete = await _context.Employees.FindAsync(id);
            _context.Remove(employeeToDelete);
            await _context.SaveChangesAsync();
        }
    }
}
