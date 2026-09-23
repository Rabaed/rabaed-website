/**
 * Run in a process of its own by `database-pool.spec.ts`, never by Playwright
 * — it is not a `.spec.ts`, so the suite does not collect it.
 *
 * It loads the Payload config under whatever environment it was started with,
 * builds the Postgres adapter from it the way Payload does, and prints on its
 * last line the pool settings the adapter will open its connections with. It
 * connects to nothing: the adapter opens no connection until Payload asks it
 * to.
 */
import config from '../../src/payload.config';

const { db } = await config;
const adapter = db.init({ payload: {} as never }) as unknown as {
  poolOptions: { max?: number; connectionTimeoutMillis?: number; idleTimeoutMillis?: number };
};

const { max, connectionTimeoutMillis, idleTimeoutMillis } = adapter.poolOptions;
console.log(
  JSON.stringify({
    max: max ?? null,
    connectionTimeoutMillis: connectionTimeoutMillis ?? null,
    idleTimeoutMillis: idleTimeoutMillis ?? null,
  }),
);
