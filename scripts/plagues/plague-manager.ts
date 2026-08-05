import { map, merge, Observable } from 'rxjs';
import { injectAll } from '../system/add-on.container';
import { PLAGUES_TOKEN, Plague } from './plague';

export interface PlagueStateChange {
  plague: Plague;
  active: boolean;
}

export class PlagueManager {
  readonly plagues = injectAll(PLAGUES_TOKEN);

  readonly plagueState$: Observable<PlagueStateChange> = merge(
    ...this.plagues.map((plague) =>
      plague.isActive$.pipe(map((active) => ({ plague, active }))),
    ),
  );

  all(): Plague[] {
    return this.plagues;
  }

  getByKey(key: string): Plague | undefined {
    return this.plagues.find((plague) => plague.key === key);
  }

  isActive(key: string): boolean {
    return this.getByKey(key)?.isActive() ?? false;
  }

  setActive(key: string, active: boolean): boolean {
    const plague = this.getByKey(key);
    if (!plague) return false;
    plague.setActive(active);
    return true;
  }

  toggle(key: string): boolean {
    const plague = this.getByKey(key);
    if (!plague) return false;
    plague.setActive(!plague.isActive());
    return plague.isActive();
  }

  activeKeys(): string[] {
    return this.plagues
      .filter((plague) => plague.isActive())
      .map((plague) => plague.key);
  }
}
