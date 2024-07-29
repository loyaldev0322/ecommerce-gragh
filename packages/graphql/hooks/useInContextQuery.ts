import type { InputMaybe, InContextInput } from '@graphcommerce/graphql-mesh'
// eslint-disable-next-line import/no-extraneous-dependencies
import { useIsSSR } from '@graphcommerce/next-ui/hooks/useIsSsr'
// eslint-disable-next-line import/no-extraneous-dependencies
import { getCssFlag, removeCssFlag, setCssFlag } from '@graphcommerce/next-ui/utils/cssFlags'
import { useEffect } from 'react'
import { QueryHookOptions, QueryResult, TypedDocumentNode, useQuery } from '../apollo'
import { useInContextInput } from './useInContextInput'

/**
 * Creates a query that allows fetching data for logged in customers, but have
 * a fallback for guest users.
 *
 * - Shows a global pageload indicator when loading customer specific information.
 *
 * When not to use this?
 * - When a query is always scoped. This method specifically targets queries that can resolve unscoped (guest) and both scoped (customer) data.
 *
 * Usage:
 * - Define a `@inContext(context: $context)` directive in your query
 * - Use the useInContextQuery
 */
export function useInContextQuery<
  Q,
  V extends { context?: InputMaybe<InContextInput>; [index: string]: unknown },
>(
  document: TypedDocumentNode<Q, V>,
  options: QueryHookOptions<Q, V>,
  unscopedResult: Q,
): Omit<QueryResult<Q, V>, 'data'> & { data: Q; mask: boolean } {
  const { skip = true } = options
  const context = useInContextInput()
  const isSsr = useIsSSR()

  useEffect(() => {
    if (isSsr) return
    if (context && !getCssFlag('in-context')) setCssFlag('in-context', true)
    else if (!context && getCssFlag('in-context')) removeCssFlag('in-context')
  }, [context, isSsr])

  const clientQuery = useQuery<Q, V>(document, {
    ...options,
    variables: { ...options.variables, context } as V,
    skip: skip && !context,
  })

  let { data } = clientQuery
  if (!skip) data ??= clientQuery.previousData

  // If the user is logged in we might need to show a skeleton:
  let mask = isSsr
  if (!isSsr && context) {
    mask = !skip ? !clientQuery.data && !clientQuery.previousData : !clientQuery.data
  }

  return { ...clientQuery, data: data ?? unscopedResult, mask }
}
