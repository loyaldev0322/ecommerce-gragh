import { ApolloCartErrorSnackbar } from '@graphcommerce/magento-cart'
import { Button, ButtonProps } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { SxProps, Theme, styled } from '@mui/material'
import {
  UseRemoveItemFromCartProps,
  useRemoveItemFromCart,
} from '../../hooks/useRemoveItemFromCart'

export type RemoveItemFromCartProps = UseRemoveItemFromCartProps & {
  sx?: SxProps<Theme>
  buttonProps?: Omit<ButtonProps, 'type' | 'loading'>
}

const Form = styled('form')({})

export function RemoveItemFromCart(props: RemoveItemFromCartProps) {
  const { uid, quantity, prices, buttonProps, ...formProps } = props

  const { submit, formState, error } = useRemoveItemFromCart(props)
  return (
    <Form noValidate onSubmit={submit} {...formProps}>
      <Button
        variant='inline'
        color='secondary'
        {...buttonProps}
        size='medium'
        type='submit'
        loading={formState.isSubmitting}
      >
        <Trans id='Remove' />
      </Button>
      <ApolloCartErrorSnackbar error={error} />
    </Form>
  )
}
