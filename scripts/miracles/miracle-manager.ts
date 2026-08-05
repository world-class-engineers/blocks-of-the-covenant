import { merge, Observable } from 'rxjs';
import { injectAll } from '../system/add-on.container';
import { MIRACLES_TOKEN, Miracle } from './miracle';

export class MiracleManager {
  readonly miracles = injectAll(MIRACLES_TOKEN);

  readonly performed$: Observable<Miracle> = merge(
    ...this.miracles.map((miracle) => miracle.performed$),
  );

  all(): Miracle[] {
    return this.miracles;
  }

  getByKey(key: string): Miracle | undefined {
    return this.miracles.find((miracle) => miracle.key === key);
  }

  perform(key: string): boolean {
    const miracle = this.getByKey(key);
    if (!miracle) return false;
    miracle.perform();
    return true;
  }
}
