import { InjectionToken } from 'tsyringe';
import type { Observable } from 'rxjs';

export interface Plague {
  readonly key: string;
  readonly displayName: string;
  readonly isActive$: Observable<boolean>;
  isActive(): boolean;
  setActive(active: boolean): void;
}

export const PLAGUES_TOKEN: InjectionToken<Plague> = Symbol(
  'the plagues of egypt',
);
