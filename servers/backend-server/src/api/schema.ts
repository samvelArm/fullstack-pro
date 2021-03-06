import { GraphQLSchema } from 'graphql';
import { addApolloLogging } from 'apollo-logger';

import { makeExecutableSchema, addMockFunctionsToSchema, addErrorLoggingToSchema } from 'graphql-tools';
import { resolvers, typeDefs } from '@sample-stack/graphql-schema';
import { GraphQLAnyObject } from './scalar';
const rootSchemaDef = require('./root-schema.graphqls');
// import rootSchemaDef from './root_schema.graphqls';
import { logger } from '@sample-stack/utils';
import { pubsub } from '../container';

const DefaultResolver = {
  AnyObject: GraphQLAnyObject,
};

const schema: GraphQLSchema = makeExecutableSchema({
  resolvers: resolvers(pubsub, logger),
  typeDefs: [rootSchemaDef].concat(typeDefs) as Array<any>,
});

addErrorLoggingToSchema(schema, { log: (e) => logger.error(e) });

addMockFunctionsToSchema({
  mocks: {},
  preserveResolvers: true,
  schema,
});


export { schema };
