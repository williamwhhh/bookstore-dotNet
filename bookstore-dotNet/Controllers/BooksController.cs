using bookstore_dotNet.Models;
using bookstore_dotNet.Services;
using Microsoft.AspNetCore.Mvc;

namespace bookstore_dotNet.Controllers;

[ApiController]
[Route("[controller]")]
public class BooksController : ControllerBase
{
    private readonly BooksService _booksService;

    public BooksController(BooksService booksService) =>
        _booksService = booksService;


    [HttpGet]
    public async Task<List<Book>> Get() =>
        await _booksService.GetAsync();

    [HttpPut("reserve/{id}")]
    public async Task<ActionResult<String>> Reserve(string id)
    {
        var book = await _booksService.GetAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        if (book.Stock > 0)
        {
            book.Stock -= 1;
            await _booksService.UpdateAsync(id, book);
            return "{\"bookingNumber\": \"" + book.Name + " - copy " + book.Stock.ToString() +
            "\", \"name\": \"" + book.Name + "\"}";
        } else
        {
            return "{\"name\": \"" + book.Name + "\"}";
        }
    }

    [HttpGet("search/{name}")]
    public async Task<List<Book>> GetByName(string name)
    {
        var books = await _booksService.GetByNameAsync(name.ToLower());

        return books;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> Get(string id)
    {
        var book = await _booksService.GetAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        return book;
    }

    [HttpPost]
    public async Task<IActionResult> Post(Book newBook)
    {
        await _booksService.CreateAsync(newBook);

        return CreatedAtAction(nameof(Get), new { id = newBook.Id }, newBook);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Book updatedBook)
    {
        var book = await _booksService.GetAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        updatedBook.Id = book.Id;

        await _booksService.UpdateAsync(id, updatedBook);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var book = await _booksService.GetAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        await _booksService.RemoveAsync(id);

        return NoContent();
    }
}