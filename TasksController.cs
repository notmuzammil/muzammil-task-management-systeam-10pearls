using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Core.Entities;
using TaskManagementSystem.Infrastructure.Data;

namespace TaskManagementSystem.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TasksController> _logger;

    public TasksController(ApplicationDbContext context, ILogger<TasksController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
    {
        try
        {
            var tasks = await _context.Tasks
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .Include(t => t.Categories)
                    .ThenInclude(tc => tc.Category)
                .ToListAsync();

            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching tasks");
            return StatusCode(500, "An error occurred while fetching tasks");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItem>> GetTask(int id)
    {
        try
        {
            var task = await _context.Tasks
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .Include(t => t.Categories)
                    .ThenInclude(tc => tc.Category)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching task {TaskId}", id);
            return StatusCode(500, "An error occurred while fetching the task");
        }
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
    {
        try
        {
            task.CreatedAt = DateTime.UtcNow;
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Task created successfully. TaskId: {TaskId}", task.Id);
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating task");
            return StatusCode(500, "An error occurred while creating the task");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TaskItem task)
    {
        if (id != task.Id)
        {
            return BadRequest();
        }

        try
        {
            task.UpdatedAt = DateTime.UtcNow;
            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Task updated successfully. TaskId: {TaskId}", id);
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TaskExists(id))
            {
                return NotFound();
            }
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating task {TaskId}", id);
            return StatusCode(500, "An error occurred while updating the task");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        try
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Task deleted successfully. TaskId: {TaskId}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting task {TaskId}", id);
            return StatusCode(500, "An error occurred while deleting the task");
        }
    }

    private bool TaskExists(int id)
    {
        return _context.Tasks.Any(e => e.Id == id);
    }
} 