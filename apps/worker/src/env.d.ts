import { Context } from 'hono';

type CFEnvironment = {
  ENVIRONMENT: 'development' | 'production';
};

type CFBindings = {};

type CF = CFEnvironment & CFBindings;

type HonoEnv = {
  Bindings: CF;
};

type HonoContext = Context<HonoEnv>;
