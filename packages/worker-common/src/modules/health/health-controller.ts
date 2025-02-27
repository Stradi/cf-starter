import { Hono } from 'hono';
import resp from '../../utils/response';

const app = new Hono();

app.get('/', (ctx) => {
  return ctx.json(
    resp({
      status: 'success',
      data: {
        status: 'ok',
      },
    })
  );
});

export default app;
