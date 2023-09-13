import { ApolloServer } from 'apollo-server-lambda';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import { readFileSync } from 'fs';


class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    // Pass the user's id from the context to each subgraph
    // as a header called `user-id`
    request.http.headers.set('user-id', context.userId);
  }
}


const supergraphSdl = readFileSync('./supergraph.graphql').toString();
const gateway = new ApolloGateway({
  supergraphSdl,
  //highlight-start
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
  //highlight-end
});

const server = new ApolloServer({
  debug: process.env.STAGE !== "prod",
  gateway,
  apollo: {
    key: process.env.APOLLO_KEY,
    graphVariant: process.env.GRAPH_VARIANT,
    graphId: "monetaryiq",
  },
  context: async ({ event }) => {
    const transformed = transformHeaders(event.headers);
    const { authorization, cookie } = transformed;

    // Get the user token from the headers
    const token = authorization || '';
    // Try to retrieve a user with the token

    // TODO: implement user id fetch from token
    // const userId = getUserId(token);

    // Add the user ID to the contextValue
    return { userId: 5 };
  },
  //highlight-end
});

function transformHeaders(headers: {
  [key: string]: string;
}): { [key: string]: string } {
  return Object.entries<string>(headers).reduce(
    (headers, [header, value]) => ({
      ...headers,
      [header.toLowerCase()]: value,
    }),
    {}
  );
}

exports.graphqlHandler = server.createHandler({
  expressGetMiddlewareOptions: {
    bodyParserConfig: {
      limit: "5mb",
    },
    cors: {
      origin: ["https://studio.apollographql.com"],
      credentials: true,
    },
  },
});
