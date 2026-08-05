import {
  DependencyContainer,
  container as globalContainer,
  InjectionToken,
} from 'tsyringe';

export const container = globalContainer.createChildContainer();

let currentContainer: DependencyContainer = container;

export function inject<T>(
  token: InjectionToken<T>,
  dependencyContainer: DependencyContainer = currentContainer,
): T {
  return dependencyContainer.resolve(token);
}

export function injectAll<T>(
  token: InjectionToken<T>,
  dependencyContainer: DependencyContainer = currentContainer,
): T[] {
  return dependencyContainer.resolveAll(token);
}

export function injectOptional<T>(
  token: InjectionToken<T>,
  dependencyContainer: DependencyContainer = currentContainer,
): T | undefined {
  return dependencyContainer.isRegistered(token)
    ? dependencyContainer.resolve(token)
    : undefined;
}

export function runInInjectionContext<T>(
  dependencyContainer: DependencyContainer,
  action: () => T,
): T {
  const previous = currentContainer;
  currentContainer = dependencyContainer;
  try {
    return action();
  } finally {
    currentContainer = previous;
  }
}
