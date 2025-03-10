# Hono Adapter

The `@zenstackhq/server/hono` module provides a quick way to install API routes onto a [Hono](https://hono.dev/) project for database CRUD operations. Combined with ZenStack's power of enhancing Prisma with access policies, it's surprisingly simple to achieve a secure data backend without manually coding it.

### Installation[​](#installation)

```bash
npm install @zenstackhq/server
```

### Mounting the API[​](#mounting-the-api)

You can use the `createHonoHandler` API to create a [Hono middleware](https://hono.dev/docs/getting-started/basic#using-middleware) that handles CRUD requests automatically:

```typescript
import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';
import { createHonoHandler } from '@zenstackhq/server/hono';
import { Context, Hono } from 'hono';

const prisma = new PrismaClient();
const app = new Hono();

app.use(
    '/api/model/*',
    createHonoHandler({
        getPrisma: (ctx) => {
            return enhance(prisma, { user: getCurrentUser(ctx) });
        },
    })
);

function getCurrentUser(ctx: Context) {
    // the implementation depends on your authentication mechanism
    ...
}
```

The middleware factory takes the following options to initialize:

*   **getPrisma** (required)

    > `(ctx: Context) => unknown | Promise<unknown>`

    A callback for getting a PrismaClient instance for talking to the database. Usually you'll use an enhanced instance created with ZenStack's [`enhance`](/docs/reference/runtime-api#enhance) API to ensure access policies are enforced.

*   **logger** (optional)

    > `LoggerConfig`

    Configuration for customizing logging behavior.

*   **modelMeta** (optional)

    > `ModelMeta`

    Model metadata. By default loaded from the `node_module/.zenstack/model-meta` module. You can pass it in explicitly if you configured ZenStack to output to a different location. E.g.: `require('output/model-meta').default`.

*   **zodSchemas** (optional)

    > `ModelZodSchema | boolean | undefined`

    Provides the Zod schemas used for validating CRUD request input. The Zod schemas can be generated with the `@core/zod` plugin. Pass `true` for this option to load the schemas from the default location. If you configured `@core/zod` plugin to output to a custom location, you can load the schemas explicitly and pass the loaded module to this option. E.g.:

    ```typescript
    factory({
        ...
        zodSchemas: require('./zod'),
    });
    ```

    Not passing this option or passing in `undefined` disables input validation.

*   **handler** (optional)

    > `(req: RequestContext) => Promise<Response>`

    The request handler function. This option determines the API endpoints and its input and output formats. Currently ZenStack supports two styles of APIs: RPC (the default) and RESTful.

    *   **RPC**

        The goal of the RPC-style API handler is to fully mirror [PrismaClient's API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#model-queries) across the network, so that developers can continue enjoying the convenience and flexibility of Prisma's query syntax. This is the default choice for the `handler` option.

        The RPC-style handler can be created like:

        ```typescript
        import { RPCApiHandler } from '@zenstackhq/server/api';
        const handler = RPCApiHandler();
        ```

        For more details, please check out [RPC API Handler](/docs/reference/server-adapters/api-handlers/rpc).

    *   **RESTful**

        The goal of RESTful-style API handler is to provide a resource-centric RESTful API using [JSON:API](https://jsonapi.org/) as transportation format.

        The RESTful-style handler can be created like:

        ```typescript
        import { RestApiHandler } from '@zenstackhq/server/api';
        const handler = RestApiHandler({ endpoint: 'http://myhost/api' });
        ```

        For more details, please check out [RESTful API Handler](/docs/reference/server-adapters/api-handlers/rest).

### Using the API[​](#using-the-api)

The APIs can be used in the following three ways:

1.  **With generated client hooks**

    ZenStack provides plugins to generate client hooks from the ZModel targeting the most popular frontend data fetching libraries: [TanStack Query](https://tanstack.com/query/latest) and [SWR](https://swr.vercel.app/). The generated hooks can be used to make API calls to the server adapters. Refer to the follow docs for detailed usage:

    *   [`@zenstackhq/tanstack-query`](/docs/reference/plugins/tanstack-query)
    *   [`@zenstackhq/swr`](/docs/reference/plugins/swr)

    info

    The generated client hooks assumes the server adapter uses [RPC-style API handler](/docs/reference/server-adapters/api-handlers/rpc) (which is the default setting).

2.  **With direct HTTP calls**

    You can make direct HTTP calls to the server adapter using your favorite client libraries like `fetch` or `axios`. Refer to the documentation of the [API Handlers](/docs/reference/server-adapters/api-handlers/) for the API endpoints and data formats.

    Here's an example using `fetch`:

    *   RPC Handler
    *   RESTful Handler

        ```typescript
        // create a user with two posts
        const r = await fetch(`/api/user/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                include: { posts: true },
                 {
                    email: 'user1@abc.com',
                    posts: {
                        create: [{ title: 'Post 1' }, { title: 'Post 2' }],
                    },
                },
            }),
        });
        console.log(await r.json());
        ```

        Output:

        ```json
        {
            "id": 1,
            "email": "user1@abc.com",
            "posts": [
                {
                    "id": 1,
                    "createdAt": "2023-03-14T07:45:04.036Z",
                    "updatedAt": "2023-03-14T07:45:04.036Z",
                    "title": "Post 1",
                    "authorId": 1
                },
                {
                    "id": 2,
                    "createdAt": "2023-03-14T07:45:04.036Z",
                    "updatedAt": "2023-03-14T07:45:04.036Z",
                    "title": "Post 2",
                    "authorId": 1
                }
            ]
        }
        ```

        ```typescript
        // create a user and attach two posts
        const r = await fetch(`/api/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/vnd.api+json' },
            body: JSON.stringify({
                 {
                    type: 'user',
                    attributes: {
                        email: 'user1@abc.com'
                    },
                    relationships: {
                        posts: {
                             [
                                { type: 'post', id: 1 },
                                { type: 'post', id: 2 }
                            ]
                        }
                    }
                }
            })
        });
        console.log(await r.json());
        ```

        Output:

        ```json
        {
            "jsonapi": { "version": "1.1" },
            "data": {
                "type": "user",
                "id": 1,
                "attributes": {
                    "email": "user1@abc.com",
                },
                "links": {
                    "self": "http://localhost/api/user/1",
                },
                "relationships": {
                    "posts": {
                        "links": {
                            "self": "http://localhost/api/user/1/relationships/posts",
                            "related": "http://localhost/api/user/1/posts",
                        },
                        "data": [
                            { "type": "post", "id": 1 },
                            { "type": "post", "id": 2 },
                        ],
                    },
                },
            },
        }
        ```

3.  **With third-party client generators**

    ZenStack provides an [OpenAPI](/docs/reference/plugins/openapi) plugin for generating Open API 3.x specification from the ZModel. The generated OpenAPI spec can be used to generate client libraries for various languages and frameworks. For example, you can use [openapi-typescript](https://github.com/drwpow/openapi-typescript) to generate a typescript client.

### Error Handling[​](#error-handling)

Refer to the specific sections for [RPC Handler](/docs/reference/server-adapters/api-handlers/rpc#http-status-code-and-error-responses) and [RESTful Handler](/docs/reference/server-adapters/api-handlers/rest#error-handling).

###### Comments

Feel free to ask questions, give feedback, or report issues.

Don't Spam

* * *

You can edit/delete your comments by going directly to the discussion, clicking on the 'comments' link below
