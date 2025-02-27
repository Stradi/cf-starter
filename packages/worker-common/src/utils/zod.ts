import { zValidator } from '@hono/zod-validator';

type Last<T extends any[]> = T extends [...infer I, infer L]
  ? L
  : T extends [...infer I, (infer L)?]
  ? L | undefined
  : never;
type LastParameter<F extends (...args: any) => any> = Last<Parameters<F>>;

const throwZodValidationError: LastParameter<typeof zValidator> = (result) => {
  if (result.success === false) {
    throw result.error;
  }
};

export default throwZodValidationError;
