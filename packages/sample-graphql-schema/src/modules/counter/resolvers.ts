import { ICounterRepository, ICount } from './database';

export const resolver = () =>( {
    Query: {
        count(obj, args, context: { Count: ICounterRepository }) {
            return context.Count.getCount();
        },
    },
    Mutation: {
        async addCount(obj, { amount }, context: { Count: ICounterRepository  }) {
            await context.Count.addCount(amount);
            let count = await context.Count.getCount();

            // pubsub.publish('countUpdated', count);

            return count;
        },
    },
    Subscription: {
        countUpdated(amount) {
            return amount;
        }
    }
})