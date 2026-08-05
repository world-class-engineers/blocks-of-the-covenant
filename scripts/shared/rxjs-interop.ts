import { fromEventPattern, Observable } from 'rxjs';

interface BedrockEventSignal<TEvent, TOptions> {
  subscribe(
    callback: (arg0: TEvent) => void,
    options?: TOptions,
  ): (arg0: TEvent) => void;
  unsubscribe(callback: (arg0: TEvent) => void): void;
}

export function fromBedrockEvent<TEvent, TOptions>(
  eventSource: BedrockEventSignal<TEvent, TOptions>,
  options?: TOptions,
): Observable<TEvent> {
  return fromEventPattern(
    (handler) => {
      if (options !== undefined) {
        return eventSource.subscribe(handler, options);
      }
      return eventSource.subscribe(handler);
    },
    (handler) => eventSource.unsubscribe(handler),
  );
}
