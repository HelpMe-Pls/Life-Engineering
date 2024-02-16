- _***Great***_ web developers put effort into making it so their users hardly ever experience that great pending UI by making the backend as fast as possible. Your UI can’t be any faster than your slowest database query.
- Design robust database architectures and optimize query performance are some of the fundamental responsibilities of a Software Engineer.
----
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

# SQL (Squeal :))
## Relationships
- For complex relationships, use the [prisma-erd-generator](https://github.com/keonik/prisma-erd-generator) to represent them visually.
- ==***Prefer isolating models***== according to their relationships rather than having a centralized model that is related to many other models. For example, having a `NoteImage` related to `Note` and `UserImage` related to `User` rather than having a single `Image` model which is referred to `User` and `Note`.
	 Even though `NoteImage` and `UserImage` are almost identical, it's still recommended to separate them for better maintainability (polymorphism and databases don't mix well).
### One-to-one
- By separating this one-to-one relationship out into two separate tables, it protects you from accidentally selecting (unwanted) stuff from one table.
- One side of the relationship ***==must be optional==***. This allows you to create an instance of one model, and then create an instance of the other model and connect them.
- The `@unique` attribute is essential for the foreign key in this relationship. An example in a `prisma.schema`:
```cs
model Person {
  id             String          @unique @default(cuid())
  name           String
// One side of the relationship must be optional, in this case, a `SocialSecurity` must belongs to a `Person`, but a `Person` may not have a `SocialSecurity`
  socialSecurity SocialSecurity?  
}

model SocialSecurity {
  id       String  @unique @default(cuid())
  number   String
// The `fields` argument specifies which fields in this model are used to refer to the other model. The `references` argument specifies which fields in the other model are used to refer to this model.
// `Cascade`: if the other model is deleted or updated, this model should be deleted or updated as well.
  person   Person @relation(fields: [personId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  // This field is specified in the `fields` key above, so it's considered a foreign key, and the `@unique` attribute marks the one-to-one relationship
  personId String @unique
}
```
### One-to-many
- The differences are at the relation field's type on the "One" model and the relationship attribute's type (`@unique`) on the "Many" model:
```cs
model Person {
  id           String        @unique @default(cuid())
  name         String
// a person can have many phone numbers
  phoneNumbers PhoneNumber[]
}

model PhoneNumber {
  id       String @unique @default(cuid())
  number   String
  person   Person @relation(fields: [personId], references: [id], onDelete: Cascade, onUpdate: Cascade)
// Notice that the `personId` field is not declared as `@unique`, because a `Person` can have MANY `PhoneNumber`s, so the same `personId` can appear multiple times in the `PhoneNumber` model
  personId String
}
```
### Many-to-many
- There's no relationship attributes in these models due to a limitation in relational models:
```ts
//------------------- schema.prisma
// Notice there's no `@relation` attributes
model User {
  id       String  @id @default(cuid())
  email    String  @unique
  username String  @unique
  
  roles    Role[]
}

model Role {
  id          String @id @default(cuid())
  name        String @unique
  description String @default("")

  users       User[]
}

//------------------- permissions.ts
export async function requireUserWithRole(request: Request, name: string) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findFirst({
		select: { id: true },
		// using `some` because of many-to-many relationship
		where: { id: userId, roles: { some: { name } } },
	})
	if (!user) {
		throw json(
			{
				error: 'Unauthorized',
				requiredRole: name,
				message: `Unauthorized: required role: ${name}`,
			},
			{ status: 403 },
		)
	}
	return user.id
}

//------------------- admin.tsx
import { requireUserWithRole } from '#app/utils/permissions.ts'

export async function loader({ request }: DataFunctionArgs) {
	await requireUserWithRole(request, 'admin')
	return json({})
}
```
## Seeding data
- A [[Databases#Keywords |seeding]] script for test data may look like:
```ts
import fs from 'node:fs'
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { UniqueEnforcer } from 'enforce-unique'
import { promiseHash } from 'remix-utils/promise'

const prisma = new PrismaClient()

const uniqueUsernameEnforcer = new UniqueEnforcer()

export function createUser() {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()

	const username = uniqueUsernameEnforcer
		.enforce(() => {
			return (
				faker.string.alphanumeric({ length: 2 }) +
				'_' +
				faker.internet.userName({
					firstName: firstName.toLowerCase(),
					lastName: lastName.toLowerCase(),
				})
			)
		})
		.slice(0, 20)
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '_')
	return {
		username,
		name: `${firstName} ${lastName}`,
		email: `${username}@example.com`,
	}
}

async function img({
	altText,
	filepath,
}: {
	altText?: string
	filepath: string
}) {
	return {
		altText,
		contentType: filepath.endsWith('.png') ? 'image/png' : 'image/jpeg',
		blob: await fs.promises.readFile(filepath),
	}
}

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	await prisma.user.deleteMany()
	console.timeEnd('🧹 Cleaned up the database...')

	const totalUsers = 5
	console.time(`👤 Created ${totalUsers} users...`)
	const noteImages = await Promise.all([
		img({
			altText: 'a nice country house',
			filepath: './tests/fixtures/images/notes/0.png',
		}),
		img({
			altText: 'a city scape',
			filepath: './tests/fixtures/images/notes/1.png',
		}),
		img({
			altText: 'a sunrise',
			filepath: './tests/fixtures/images/notes/2.png',
		}),
		img({
			altText: 'a group of friends',
			filepath: './tests/fixtures/images/notes/3.png',
		}),
		img({
			altText: 'friends being inclusive of someone who looks lonely',
			filepath: './tests/fixtures/images/notes/4.png',
		}),
		img({
			altText: 'an illustration of a hot air balloon',
			filepath: './tests/fixtures/images/notes/5.png',
		}),
		img({
			altText:
				'an office full of laptops and other office equipment that look like it was abandond in a rush out of the building in an emergency years ago.',
			filepath: './tests/fixtures/images/notes/6.png',
		}),
		img({
			altText: 'a rusty lock',
			filepath: './tests/fixtures/images/notes/7.png',
		}),
		img({
			altText: 'something very happy in nature',
			filepath: './tests/fixtures/images/notes/8.png',
		}),
		img({
			altText: `someone at the end of a cry session who's starting to feel a little better.`,
			filepath: './tests/fixtures/images/notes/9.png',
		}),
	])

	const userImages = await Promise.all(
		Array.from({ length: 10 }, (_, index) =>
			img({ filepath: `./tests/fixtures/images/user/${index}.jpg` }),
		),
	)

	for (let index = 0; index < totalUsers; index++) {
		await prisma.user
			.create({
				data: {
					...createUser(),
					image: { create: userImages[index % 10] },
					notes: {
						create: Array.from({
							length: faker.number.int({ min: 1, max: 3 }),
						}).map(() => ({
							title: faker.lorem.sentence(),
							content: faker.lorem.paragraphs(),
							images: {
								create: Array.from({
									length: faker.number.int({ min: 1, max: 3 }),
								}).map(() => {
									const imgNumber = faker.number.int({ min: 0, max: 9 })
									return noteImages[imgNumber]
								}),
							},
						})),
					},
				},
			})
			.catch(e => {
				console.error('Error creating a user:', e)
				return null
			})
	}
	console.timeEnd(`👤 Created ${totalUsers} users...`)

	console.time(`🐨 Created user "kody"`)

	const kodyImages = await promiseHash({
		kodyUser: img({ filepath: './tests/fixtures/images/user/kody.png' }),
		cuteKoala: img({
			altText: 'an adorable koala cartoon illustration',
			filepath: './tests/fixtures/images/kody-notes/cute-koala.png',
		}),
		koalaEating: img({
			altText: 'a cartoon illustration of a koala in a tree eating',
			filepath: './tests/fixtures/images/kody-notes/koala-eating.png',
		}),
		koalaCuddle: img({
			altText: 'a cartoon illustration of koalas cuddling',
			filepath: './tests/fixtures/images/kody-notes/koala-cuddle.png',
		}),
		mountain: img({
			altText: 'a beautiful mountain covered in snow',
			filepath: './tests/fixtures/images/kody-notes/mountain.png',
		}),
		koalaCoder: img({
			altText: 'a koala coding at the computer',
			filepath: './tests/fixtures/images/kody-notes/koala-coder.png',
		}),
		koalaMentor: img({
			altText:
				'a koala in a friendly and helpful posture. The Koala is standing next to and teaching a woman who is coding on a computer and shows positive signs of learning and understanding what is being explained.',
			filepath: './tests/fixtures/images/kody-notes/koala-mentor.png',
		}),
		koalaSoccer: img({
			altText: 'a cute cartoon koala kicking a soccer ball on a soccer field ',
			filepath: './tests/fixtures/images/kody-notes/koala-soccer.png',
		}),
	})

	await prisma.user.create({
		data: {
			email: 'kody@kcd.dev',
			username: 'kody',
			name: 'Kody',
			image: { create: kodyImages.kodyUser },
			notes: {
				create: [
					{
						id: 'd27a197e',
						title: 'Basic Koala Facts',
						content:
							'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
						images: { create: [kodyImages.cuteKoala, kodyImages.koalaEating] },
					},
				],
			},
		},
	})
	console.timeEnd(`🐨 Created user "kody"`)

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
```
## Query Optimization
- In a typical web application you almost _always_ will want to optimize for speed of reads over storage cost and speed of writes. This is because most web applications are read-heavy, and storage costs are relatively minimal.
- An index on a database column is *extra data* (managed by the database) that the database can reference when performing queries rather than looking at the individual records themselves. It has massive potential to speed up your queries by a huge margin.
- In web applications, you should ***default to adding indexes*** that speed up queries and only if it becomes a performance problem should you consider removing them. By default, you should probably ***index foreign keys** for fields which are **not** unique*.
- Anything that appears in your `WHERE` clause or `ORDER BY` clause is also worth an indexing consideration. If you're filtering or sorting by a column, you can probably speed up the query quite a bit by adding an index on that column. And in some cases you'll want to add a multi-column index (for the "find by X, then sort those by Y scenario").
- CPU spikes are a common indicator for index opportunities, so watch for the queries that cause spikes. ==Measuring the *before* and *after* when apply indexing is a good practice:==
```sql
-- BEFORE: When scanning an unoptimized query where its `WHERE` clause is not indexed (so the database is going to do a FULL table scan):
EXPLAIN QUERY PLAN SELECT * FROM user WHERE name = 'Alice';
------------- Start output 
QUERY PLAN
`--SCAN user
------------- End output 

-- AFTER: Scanning a query with an indexed column (`username`):
EXPLAIN QUERY PLAN SELECT * FROM user WHERE username = 'alicerocks';
------------- Start output 
QUERY PLAN
`--SEARCH user USING INDEX User_username_key (username=?)
------------- End output 
```
- For multi-column queries, a well-designed composite index is often more efficient. Generally, in a composite (multi-column) index, start with the column that is most frequently used in your `WHERE` clause and can be most utilized, then add frequently `ORDER BY` columns to the end of the index (i.e. start with "bigger buckets" and get more specific as you go).
- Checkout [[Databases#Indexing |indexing]] for examples.

# ORM (Object Relational Mappers)
## Prisma
- Prisma is a suite of tools that allow you to manage your database and communicate with it more easily in your JavaScript application.
- It allows you to interact with your database using JavaScript objects and function calls instead of SQL.
### Keywords
- **Schema**: written in Prisma's syntax (which is more human readable and easier to manage than SQL), it represents models and their relationships that map to tables in the actual database.
- **Migrations**: allow you to track and synchronize schema changes across environments. Checkout the ["widen then narrow"](https://github.com/epicweb-dev/epic-stack/blob/main/docs/database.md#migrations) strategy.
- **Seeding**: a script to [populate data](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding) in your database that you can use ***to test*** your application and ***for initializing*** your database with data that you know you'll need. Typically it's best for this script to be idempotent (i.e. run the seed script as a way to refresh the data):
```ts
// In package.json:
"prisma": {
	"seed": "npx tsx prisma/seed.ts"
} // This command will be run automatically whenever the `npx prisma migrate dev/deploy` command is run or whenever you run `npx prisma db seed` manually

// In seed.ts
import fs from 'node:fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// To make sure the script is idempotent
await prisma.user.deleteMany()

await prisma.user.create({
	data: {
		email: 'kody@kcd.dev',
		username: 'kody',
		name: 'Kody',
		notes: {
// `create` here is a served as an argument in `prisma.user.create`, not an attribute in the `data`. It creates new `Note` records associated with the `User` being created. Each object in this array corresponds to a new `Note`. 
			create: [
				{
					id: 'd27a197e',
					title: 'Basic Koala Facts',
					content: 'Some random strings',
					images: {
					// Same thing
						create: [
							{
								altText: 'an illustration',
								contentType: 'image/png',
								blob: await fs.promises.readFile(
									'./images/kody-notes/cute-koala.png',
								),
							},
							{
								altText: 'another illustration',
								contentType: 'image/png',
								blob: await fs.promises.readFile(
									'./images/kody-notes/koala-eating.png',
								),
							},
						],
					},
				},
			],
		},
	},
})

// On production:
// 1. Backup
// 1.1. Have a script to create/update the records, or get those update from somewhere like from an existing .sql file
// 2. Create a new database file (locally, let's call it `seed.db`, generated by running `npx prisma migrate deploy` or from the script in step 1.1)
// 3. Dump the seed file by running `sqlite3 seed.db .dump > seed.sql`
// 4. Copy `seed.sql` to prod
// 5. Run `seed.sql` on prod with: `sqlite3 data.db < seed.sql`
// 6. Profit
```

### CLI commands
- To generate the SQL (from your `prisma.schema`) and run it on your database, run: `npx prisma db push`
- To turn your database schema into a Prisma schema: `npx prisma db pull`
- To view and edit your database using a web interface: `npx prisma studio`
- To commit a schema change (to production): `npx prisma migrate deploy`.  This command should generally be part of an automated CI/CD pipeline. It’s *not* recommended to run this command locally to deploy changes to a production database. 
	  If you want to perform migrations in development, use `npx prisma migrate dev` instead

### Prisma Client
- Instead of writing SQL queries by hand, we can use the Prisma Client to generate and execute the SQL for us:
```ts
// Equivalent of `SELECT id, name, email FROM user WHERE id = 1;`
const user1 = await prisma.user.findUnique({
	where: { id: 1 },
	select: { id: true, name: true, email: true },
})

// update the rocket with the id "1" to have the name "Falcon 9" if it exists,
// otherwise create a new rocket with the name "Falcon 9"
await prisma.rocket.upsert({
	where: { id: 1 },
	update: { name: 'Falcon 9' },
	create: { name: 'Falcon 9' },
})

// It is what it is
await prisma.rocket.delete({
	where: { id: 1 },
})
```
- Remember to reuse the existing `PrismaClient` and only create a new one if there isn't any (so that we don't create a new connection to our database every time we make a change)
```ts
import { PrismaClient } from '@prisma/client'

// Store the `PrismaClient` instance in a variable on `global` (which is unchanged between re-evaluations of our server code), and then we check if it exists before creating a new one
if (!global.prisma) {
	global.prisma = new PrismaClient()
}

export const prisma = global.prisma
```
#### Raw SQL
- Be aware that the Prisma Client isn't as powerful as SQL. There are things that you may want to do which the Prisma Client cannot express. In such cases (e.g. using `ORDER BY`), we can use `prisma.$queryRaw` to execute raw SQL queries and `zod` to define a schema for the data we expect to get back from that raw query, then validate it:
```ts
import { z } from 'zod'

const UserSearchResultSchema = z.object({
	id: z.string(),
	username: z.string(),
	name: z.string().nullable(),
	imageId: z.string().nullable(),
})

const UserSearchResultsSchema = z.array(UserSearchResultSchema)

export async function loader({ request }: DataFunctionArgs) {
	const searchTerm = new URL(request.url).searchParams.get('search')
	if (searchTerm === '') {
		return redirect('/users')
	}

	const like = `%${searchTerm ?? ''}%`
	const rawUsers = await prisma.$queryRaw`
		SELECT User.id, User.username, User.name, UserImage.id AS imageId
		FROM User
		LEFT JOIN UserImage ON UserImage.userId = User.id
		WHERE User.username LIKE ${like}
		OR User.name LIKE ${like}
		ORDER BY (
			SELECT Note.updatedAt
			FROM Note
			WHERE Note.ownerId = user.id
			ORDER BY Note.updatedAt DESC
			LIMIT 1
		) DESC
		LIMIT 50
	`

	const result = UserSearchResultsSchema.safeParse(rawUsers)
	if (!result.success) {
		return json({ status: 'error', error: result.error.message } as const, {
			status: 400,
		})
	}
	return json({ status: 'idle', users: result.data } as const)
}
```
### Query & Update data
- A ***transaction*** in SQL follows the principle of “***all or nothing***”. This means that if *any* operation within the transaction fails, then the *entire* transaction is rolled back, and none of the operations within the transaction are applied:
```ts
// In SQL:
BEGIN TRANSACTION;
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
COMMIT;

// In Prisma, you can use nested query for transactions:
await prisma.note.update({
  select: { id: true },
  where: { id: params.noteId },
  data: {
	  title,
	  content,
	  images: {
	      deleteMany: { id: { notIn: imageUpdates.map(i => i.id) } },
		  updateMany: imageUpdates.map(updates => ({
			  where: { id: updates.id },
			  data: { ...updates, id: updates.blob ? cuid() : updates.id },
		  })),
		  create: newImages,
	  },
  },
})
```
- Transactions are typically used in banking operations or any other high-risk sequential operations.
#### Joins
![[sql-joins.png]]
- Checkout [[Databases#Raw SQL |an example]].
### Indexing
- Prisma automatically creates an index on fields that have `@unique` on them, so if your foreign key has `@unique`, then you don't need to add an index for that one. If you want to manually add an index, you can use the `@@index` attribute (typically in [[Databases#One-to-many |One-to-many]] relationships). Most indexes should be accompanied by a comment explaining why they exist:
```cs
model Starport {
  id         String      @id @default(cuid())
  name       String
  location   Location    @relation(fields: [locationId], references: [id])
  locationId String

// A single-column index on a non-unique foreign key helps speed up queries that search based ONLY on `locationId` 
  @@index([locationId])
  
// A multi-column index on the `locationId` foreign key and the `name` field. It's useful if you wanted to look up `Starport`s by their `locationId` AND THEN sort them by `name`
  @@index([locationId, name]) 
}
```
