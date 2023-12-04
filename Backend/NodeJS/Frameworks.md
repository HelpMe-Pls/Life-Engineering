# NestJS

## Overview
- A minimal data flow of a RESTful backend using NestJS:
	1. **Module**: The application is structured into modules in NestJS. Each module encapsulates a specific feature or functionality of the application. Modules are responsible for importing and exporting dependencies, including controllers, services, and other modules.
	2. **Request**: The client sends an `HTTP` request to the server, specifying the desired resource and the desired operation (`GET`, `POST`, `PUT`, `DELETE`,...).
	3. **Routing**: The server receives the request and the routing mechanism in NestJS identifies the appropriate controller and method to handle the request based on the URL and `HTTP` method.
	4. **Controller**: responsible for handling incoming requests and returning responses to the client. It extracts any parameters or body data that may be included in the request, then delegates the actual business logic to a service class.
	5. **Service/Provider**: performs any necessary operations, such as querying or updating data from a database or performing calculations.
	6. **Response**: Once the service has completed its operations, it returns the result back to the controller. The controller then prepares the response to be sent back to the client.
	7. **Serialization**: The response data is serialized into the desired format (JSON, XML, etc.) based on the client's request and the response headers are set accordingly.
	8. **Sending Response**: finally, the serialized response is sent back to the client as an `HTTP` response.
- There are also **Middleware** (basically the same concepts of middleware in Express, they are used to modify the request and response objects before they are passed to the controllers) standing between step 2-3 and **Interceptors** (which wrap the request/response stream, allowing you to implement custom logic both before and after the execution of the final route handler) standing between step 4-5 and 6-7.

## Concepts
### Dependency Injection
- It helps us to write code that is loosely coupled, more maintainable, and easier to test.
- With dependency injection (DI), we can easily swap out dependencies for a different implementation or a mock when running tests, without having to changing the code of the classes that use them:
```ts
// Without DI:
class Engine {
    start() {
        console.log("Engine started");
    }
}

class MockEngine extends Engine {
    start() {
        // void
    }
}

class Car {
    private engine: Engine;
    constructor() {
        this.engine = new Engine(); // Hard-coded dependency, i.e. if we want to use `MockEngine` instead, we'll have to update this code
    }

    startCar() {
        this.engine.start();
    }
}

let car = new Car();
car.startCar(); // Outputs: "Engine started"
//--------------------------------------

// With DI:
class Engine {
    start() {
        console.log("Engine started");
    }
}

class MockEngine extends Engine {
    start() {
        // void
    }
}

class Car {
    private engine: Engine;
    constructor(engine: Engine) {
        this.engine = engine; // Injected dependency
    }

    startCar() {
        this.engine.start();
    }
}

let mockEngine = new MockEngine();
// Now we can easily use `MockEngine` in the `Car` class by injecting it through the constructor.
// Most importantly: we didn’t have to change the `Car` class’s code to do this.
let car = new Car(mockEngine); 
car.startCar(); // Doesn't output anything

```
### Controller
- The **routing** mechanism controls which controller receives which requests. Usually, each controller has more than one route, and different routes can perform different actions.
- Decorators associate classes with required metadata and enable Nest to create a routing map (to tie requests to the corresponding controllers).
- The `@Controller()` decorator is **required** to define a basic controller:
```ts
import { Controller, Get, Post, Param, HttpCode } from '@nestjs/common';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { CatsService } from './cats.service';

class ListAllEntities {   // `zod` equivalent
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit: number;
}
interface Cat {
  name: string;
  age: number;
  breed: string;
}

@Controller('cats')  // handles `/cats/...` routes
export class CatsController {
// The `CatsService` is INJECTED through the class constructor:
  constructor(private catsService: CatsService) {}

  // a `@Get('breed')` decorator would produce a route mapping for requests like `GET /cats/breed`
  @Get()   // in this case, map `GET /cats` requests to this handler
  async findAll(): Promise<Cat[]> { // the method name is completely arbitrary
    return this.catsService.findAll(); // make use of DI
  }
  // Routes with parameters should be declared after any static paths. This prevents the parameterized paths from intercepting traffic destined for the static paths:
  @Get(':id')  // map `GET /cats/[id]` requests to this handler
  findOne(@Param() params: any): string {
    return `This action returns a #${params.id} cat`;
  }
  @Get()
  // the response status code is always 200 by default, except for POST requests which are 201. We can easily change this behavior by adding the `@HttpCode(...)` decorator at a handler level:
  @HttpCode(304)
  findAll(@Query('limit') limit: number) {
  // `limit === 5` for this URL: 'http://localhost:3000/cats?limit=5'
    return `This action returns all cats (available: ${limit} items)`;
  }
}
```
#### Sub-domain routing
- The `@Controller` decorator can take a `host` option to require that the HTTP host of the incoming requests matches some specific value:
```ts
// If you make a GET request to 'john.example.com', this controller would handle the request and the `getInfo()` method would return ‘john’.
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;
  }
}
```
#### Request payloads
- A **D**ata **T**ransfer **O**bject is an object that defines how the data will be sent over the network. It is recommended to define a DTO schema by using TS classes.
```ts
// create-cat.dto.ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

// cats.controller.ts
...
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
...
```
### Provider
- The main idea of a provider is that it can be **injected** as a dependency; this means objects can create various relationships with each other, and the function of "wiring up" these objects can largely be delegated to the Nest runtime system.
- For a provider to be available for injection, it needs to be included in the `providers` array of a module:
```ts
// cats.service.ts
@Injectable()
export class CatsService {
 findAll() {
    return ['Cat 1', 'Cat 2', 'Cat 3'];
  }
}

// cats.module.ts
@Module({
  providers: [CatsService],
})
export class CatsModule {}
```
- If you want to make `CatsService` available for injection in other modules, you need to `export` it in `CatsModule` and then import `CatsModule` in the other modules (`AppModule` in the following example):
```ts
// cats.service.ts
@Injectable()
export class CatsService {}

// cats.module.ts
@Module({
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}

// app.module.ts
@Module({
  imports: [CatsModule],
})
export class AppModule {}

```

### Modules
- Controllers always belong to a module, which is why we include the `controllers` array within the `@Module()` decorator. Providers of the same application domain is also included in a *feature module*, which organizes code relevant for a specific feature, keeping code organized and establishing clear boundaries:
```ts
// cats/cats.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

// Use `@Global` when you want to provide a set of providers which should be available everywhere out-of-the-box (e.g., helpers, database connections, etc.)
@Global() // Global modules should be registered only ONCE, generally by the root or core module
// By making it global, the `CatsService` provider will be ubiquitous, and modules that wish to inject the service will not need to import the `CatsModule` in their `imports` array.
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]  // When a provider needs to be visible OUTSIDE of a module, it is first exported from its host module, and then imported into its consuming module (in the `imports` array)
})
export class CatsModule {}
```
> [!warning]-  Making every modules global is not a good design decision
> Global modules purpose is to reduce the amount of necessary boilerplate. The `imports` array is generally the preferred way to make the module's API available to consumers.
#### Dynamic module
- Also known as *configuration module*, like a plugin, it's a general purpose module that needs to behave differently in different use cases by providing an API for importing one module into another, and customizing the properties and behavior of that module when it is imported. 
- By delegating the management of configuration parameters to a dynamic module, the application source code remains independent of configuration parameters:
```ts
// db.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}

// Use it in app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/db.module';

const databaseOptions = {
  DEVELOPMENT: {
    host: 'localhost',
    port: 3306,
    database: 'development',
  },
  STAGING: {
    host: 'staging.example.com',
    port: 3306,
    database: 'staging',
  },
  PRODUCTION: {
    host: 'production.example.com',
    port: 3306,
    database: 'production',
  },
};
const databaseEntities = ['User', 'Post'];

@Module({
  imports: [DatabaseModule.forRoot(databaseEntities, databaseOptions[process.env.NODE_ENV])],
})
export class AppModule {}
```

### Exceptions
- Nest provides a built-in `HttpException` class, exposed from the `@nestjs/common` package:
```ts
import { BadRequestException } from '@nestjs/common'

@Get()
async findAll() {
  try {
    await this.service.findAll()
  } 
  catch (error) { 
    throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description' })
  }
}

// Output:
{
  "message": "Something bad happened",
  "error": "Some error description",
  "statusCode": 400,
}
```
- A full list of built-in HTTP exceptions can be found [here](https://docs.nestjs.com/exception-filters#built-in-http-exceptions).
- Enable DI by [binding filters](https://docs.nestjs.com/exception-filters#binding-filters).
- You can register a global-scoped filter **directly from any module** using `APP_FILTER`. In case you don't want DI, use the `useGlobalFilters` method:
```ts
// With `APP_FILTER`:
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './some-where';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

// With `useGlobalFilters`:
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './some-where';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

### Pipes
- Pipes are used for data ***validation*** and ***transformation***. They operate on the arguments that are passed into a method and can either return the data unaltered, throw an exception, or return a transformed version of the data.
- A full list of built-in pipes can be found [here](https://docs.nestjs.com/pipes#built-in-pipes).
- Define a custom pipe with the `@Injectable()` decorator and `implements` the `PipeTransform` interface.
- When an exception is thrown in a Pipe, no controller method is subsequently executed. This gives you a best-practice technique for validating data coming into the application from external sources at the system boundary.
- Use the `@UsePipes()` decorator and `zod` for object [schema validation](https://docs.nestjs.com/pipes#object-schema-validation). You can also use the `class-validator` library if you prefer decorator-based validation.
- A typical use case for the data transformation of pipes could be apply default values to some required data fields that may be missing:
```ts
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page });
}
```

### Guards
- Guards are responsible for ***authorization*** (i.e. determine whether a given request will be handled by the route handler or not, depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time).
- A guard is defined with the `@Injectable()` decorator and `implements` the `CanActivate` interface:
```ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request); // `validateRequest` could be imported of implemented as a private method in this same class
  }
}
```
- Apply a guard with a `@UseGuards` decorator:
```ts
import { @UseGuards } from '@nestjs/common'
import RolesGuard from './roles.guard.ts'

@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```
- Guards are executed **after** all middleware, but **before** any interceptor or pipe. They have access to the `ExecutionContext` instance, and thus know exactly what's going to be executed next. For example, you want to make the return value conditional based on the comparing the **roles assigned to the current user** to the actual roles required by the current route being processed:
```ts
// roles.decorator.ts:
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();

// cats.controller.ts:
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}

// roles.guard.ts:
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles); // `matchRoles` could be imported of implemented as a private method in this same class
  }
}

// When a user with insufficient privileges requests an endpoint, Nest automatically returns the following response:
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### Interceptors
- An interceptor is a class annotated with the `@Injectable()` decorator and implements the `NestInterceptor` interface.
- Use it to bind extra logic before / after method execution, transform the result returned from a function, extend or override a function:
```ts
// For example: transform each occurrence of a `null` value to an empty string ''
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map(value => value === null ? '' : value ));
  }
}
```

- Override thrown exceptions by using RxJS's `catchError`, replacing the original error:
```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => throwError(() => new BadGatewayException())),
      );
  }
}

```


## Techniques


