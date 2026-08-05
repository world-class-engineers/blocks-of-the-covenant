import { InjectionToken } from 'tsyringe';
import type { Observable } from 'rxjs';

export interface Miracle {
  readonly key: string;
  readonly displayName: string;
  readonly performed$: Observable<Miracle>;
  perform(): void;
}

export const MIRACLES_TOKEN: InjectionToken<Miracle> = Symbol(
  'the wonders of the covenant',
);
