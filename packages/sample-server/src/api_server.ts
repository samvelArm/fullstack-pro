/// <reference path='../../../typings/index.d.ts' />
/// <reference types="webpack-env" />

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import { invert, isArray } from 'lodash';
import { GRAPHIQL_ROUTE, GRAPHQL_ROUTE } from './ENDPOINTS';
import * as Webpack from 'webpack';
const queryMap = require('persisted_queries.json');
import { corsMiddleware } from './middleware/cors';
7	
import { graphqlExpressMiddleware } from './middleware/graphql';
import { graphiqlExpressMiddleware } from './middleware/graphiql';
import { addGraphQLSubscriptions } from './api/subscriptions';
const { settings } = require('../../../package.json');
import { logger } from '../../../src/logger';

let server;
const app = express();

const port = process.env.PORT || settings.apiPort;

// Don't rate limit heroku
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// if (settings.persistGraphQL && process.env.NODE_ENV !== 'test') {
//     const invertedMap = invert(queryMap);

//     app.use(
//         GRAPHQL_ROUTE,
//         (req, res, next) => {
//             if (isArray(req.body)) {
//                 req.body = req.body.map(body => {
//                     const id = body['id'];
//                     return {
//                         query: invertedMap[id],
//                         ...body
//                     }
//                 });
//                 next();
//             } else {
//                 if (!__DEV__ || (req.get('Referer') || '').indexOf(GRAPHIQL_ROUTE) < 0) {
//                     res.status(500).send('Unknown GraphQL query has been received, rejecting...');
//                 } else {
//                     next();
//                 }
//             }
//         }
//     )
// }
app.use(corsMiddleware);
app.use(GRAPHQL_ROUTE, graphqlExpressMiddleware);
app.use(GRAPHIQL_ROUTE, graphiqlExpressMiddleware);


server = http.createServer(app);

addGraphQLSubscriptions(server);

server.listen(port, () => {
    logger.info(`API is now running on port ${port}`);
});

server.on('close', () => {
    server = undefined;
});

if (module.hot) {
    module.hot.dispose(() => {
        try {
            if (server) {
                server.close();
            }
        } catch (error) {
            logger.error(error.stack);
        }
    });

    module.hot.accept(['./api/subscriptions'], () => {
        try {
            addGraphQLSubscriptions(server);
        } catch (error) {
            logger.error(error.stack);
        }
    });

    module.hot.accept();
}

export default server;