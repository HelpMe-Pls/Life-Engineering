# NoSQL (Not Only SQL)
## MongoDB
### Overview
- MongoDB has a flexible schema model, which means that documents in the *same* collection are ***not*** required to share a common structure of fields and value types by default.
- A "collection" of "documents" in a MongoDB database is analogous to a "table" of "rows" in a relational database.
#### Keywords
- **Atlas**: provides an easy way to *host and mange* your clusters in the cloud providers of your choice.
- **Cluster**: a *deployment architecture* that consists of multiple servers (nodes) working together to store and manage data. Each server within a cluster can host one or more databases.
- **Database**: a container for collections.
- **Collection**: a group of documents.
- **Document**: the basic unit of data in MongoDB, displayed in JSON format.

### Operations
#### Connecting
- A simple connection to your MongoDB Atlas with Mongoose ODM may look like:
```js
// Import mongoose
import mongoose from 'mongoose';

// Set up mongoose connection
mongoose.set('strictQuery', false);

const mongoDB = process.env.YOUR_CONN_STRING

main().catch((err) => console.log(err));


async function main() {
  await mongoose.connect(mongoDB);
}
```

#### Defining schemas
- A schema defines *the structure* of a document or record in a MongoDB collection, including the fields, their types, their default values, and any validation rules that should be applied to the data. They are the **Model** in the MVC concept.
```js
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// `ref` is like a foreign key
const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

// Virtual for book's URL. A virtual is like a temporary field for `get` and display purposes only, it isn't applied to the actual document in the database
BookSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the `this` object
  return `/catalog/book/${this._id}`;
});

// Export model
module.exports = mongoose.model("Book", BookSchema);

```

### Best practices
- it is often better to have *a field* that defines the relationship between the documents/models in just _one_ model (so that you won't bloat the document's limited size):
```json
// This model setup makes sense because 1 user may have too many posts
// User document:
{
  _id: ObjectId("507f191e810c19729de860ea"),
  username: 'user1',
  post_ids: [ObjectId("507f191e810c19729de860eb"), ObjectId("507f191e810c19729de860ec")]
}

// Post documents:
{
  _id: ObjectId("507f191e810c19729de860eb"),
  title: 'Post 1',
  content: 'Content 1'
},
{
  _id: ObjectId("507f191e810c19729de860ec"),
  title: 'Post 2',
  content: 'Content 2'
},...
```
