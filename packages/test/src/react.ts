import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  type RenderHookOptions,
  type RenderHookResult,
  renderHook as renderHook_,
  waitFor as waitFor_,
  type waitForOptions,
} from '@testing-library/react'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'

import { config } from './config.js'

export const queryClient = new QueryClient()

export function createWrapper<TComponent extends React.FunctionComponent<any>>(
  Wrapper: TComponent,
  props: Parameters<TComponent>[0],
) {
  return function CreatedWrapper({
    children,
  }: { children?: React.ReactNode | undefined }) {
    return React.createElement(
      Wrapper,
      props,
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children,
      ),
    )
  }
}

export function renderHook<Result, Props>(
  render: (props: Props) => Result,
  options?: RenderHookOptions<Props>,
): RenderHookResult<Result, Props> {
  queryClient.clear()
  return renderHook_(render, {
    wrapper: createWrapper(WagmiConfig, { value: config }),
    ...options,
  })
}

export function waitFor<T>(
  callback: () => Promise<T> | T,
  options?: waitForOptions,
): Promise<T> {
  return waitFor_(callback, { timeout: 10_000, ...options })
}

export { act, cleanup } from '@testing-library/react'