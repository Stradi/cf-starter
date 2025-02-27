import { HonoEnv } from '@/env';
import {
  BaseError,
  customHeadersMiddleware,
  errorMiddleware,
  notFoundMiddleware,
} from '@cf-starter/worker-common';
import { DurableObject } from 'cloudflare:workers';
import { Hono } from 'hono';

export type DefaultState = {
  _isInitialized: boolean | undefined;
  identifier: string | undefined;
};

export type Router = Hono<HonoEnv>;

const STATE_KEY = '__STATE__';

export default abstract class BaseDurableObject<
  Bindings extends HonoEnv = HonoEnv,
  State extends DefaultState = DefaultState,
  StateWithoutDefault = Omit<State, '_isInitialized' | 'identifier'>
> extends DurableObject<Bindings> {
  private _isInitialized: boolean | undefined;
  private _childStateVariables: StateWithoutDefault;

  protected identifier: string | undefined;
  protected router?(app: Router): void;

  constructor(
    state: DurableObjectState,
    env: Bindings,
    initialState?: StateWithoutDefault,
    afterRestoreState?: () => Promise<void> | void
  ) {
    super(state, env);

    this._isInitialized = false;
    this._childStateVariables = initialState ?? ({} as StateWithoutDefault);

    this.ctx.blockConcurrencyWhile(async () => {
      await this.restoreStateFromStorage();

      if (afterRestoreState) {
        await afterRestoreState();
      }
    });
  }

  async fetch(request: Request): Promise<Response> {
    const app = new Hono<HonoEnv>();

    app.use(customHeadersMiddleware());
    app.onError(errorMiddleware());
    app.notFound(notFoundMiddleware());

    if (!this._isInitialized) {
      throw new BaseError({
        internal: true,
        statusCode: 400,
        code: 'DURABLE_OBJECT_NOT_INITIALIZED',
        message:
          'Durable Object is not initialized and cannot handle fetch requests yet',
        details: {
          id: this.ctx.id,
        },
      });
    }

    this.router?.(app);

    return app.fetch(request);
  }

  public async isInitialized() {
    return this._isInitialized;
  }

  public async initialize(identifier?: string) {
    this._isInitialized = true;
    this.identifier = identifier;
    await this.saveStateToStorage();
    return true;
  }

  protected async restoreStateFromStorage() {
    const state = await this.ctx.storage.get<State>(STATE_KEY);
    if (!state) return;

    const { _isInitialized, identifier, ...childStateVariables } = state;

    this._isInitialized = _isInitialized;
    this.identifier = identifier;

    this._childStateVariables = {
      ...this._childStateVariables,
      ...childStateVariables,
    };
  }

  protected async saveStateToStorage() {
    await this.ctx.storage.put(STATE_KEY, {
      _isInitialized: this._isInitialized,
      identifier: this.identifier,
      ...this._childStateVariables,
    });
  }

  protected getInitialState() {
    return this._childStateVariables;
  }
}
