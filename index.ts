import { initTRPC } from '@trpc/server';
// import type { Application, ApplicationModelType, ApplicationServiceType } from '@arken/seer-protocol/types';
import { z } from 'zod';
import { createRouter as createCoreRouter } from './core/core.router';
import * as dotenv from 'dotenv';

export * as Core from './core/core.router';

export const t = initTRPC.context<{}>().create();
export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const createRouter = (service: any) =>
  router({
    core: createCoreRouter(t),
  });

export type Router = ReturnType<typeof createRouter>;

dotenv.config();

// export default class Server implements Application {
//   router: Router;
//   service: ApplicationServiceType = {};
//   model: ApplicationModelType = {};

//   server: any;
//   http: any;
//   https: any;
//   isHttps: boolean;
//   cache: any;
//   db: any;
//   services: any;
//   applications: any;
//   application: any;
//   filters: Record<string, any> = { applicationId: null };
// }
