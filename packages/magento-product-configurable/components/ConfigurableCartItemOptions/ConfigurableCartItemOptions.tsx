import { CartItemFragment, SelectedCustomizableOptions } from '@graphcommerce/magento-cart-items'
import { Box } from '@mui/material'
import { ConfigurableCartItemFragment } from '../../ConfigurableCartItem/ConfigurableCartItem.gql'

type ConfigurableActionCartItemProps = ConfigurableCartItemFragment & CartItemFragment

export function ConfigurableCartItemOptions(props: ConfigurableActionCartItemProps) {
  const { configurable_options } = props
  return (
    <>
      {configurable_options?.map((option) => (
        <Box key={option?.configurable_product_option_uid}>{option?.value_label}</Box>
      ))}

      <SelectedCustomizableOptions {...props} />
    </>
  )
}
