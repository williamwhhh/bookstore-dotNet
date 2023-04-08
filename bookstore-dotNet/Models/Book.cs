using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace bookstore_dotNet.Models
{
	public class Book
	{
        public Book(string bookId, string name)
        {
            BookId = bookId;
            Name = name;
        }
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string BookId { get; set; }

        public string Name { get; set; }

        public int Quantity { get; set; }

        public int Stock { get; set; }
    }
}

