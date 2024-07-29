import { Box, SxProps, Theme } from '@mui/material'
import { ProductFilterEqualSection } from './ProductFilterEqualSection'
import { ProductFilterRangeSection } from './ProductFilterRangeSection'
import {
  ProductFiltersProAggregations,
  ProductFiltersProAggregationsProps,
  productFiltersProSectionRenderer,
} from './ProductFiltersProAggregations'
import {
  ProductFiltersCategorySectionProps,
  ProductFiltersProCategorySection,
} from './ProductFiltersProCategorySection'
import { ProductFiltersProLimitSection } from './ProductFiltersProLimitSection'
import {
  ProductFiltersProSortSection,
  ProductFiltersProSortSectionProps,
} from './ProductFiltersProSortSection'

export type ProductFiltersProAllFiltersSidebarProps = ProductFiltersProAggregationsProps &
  ProductFiltersProSortSectionProps &
  ProductFiltersCategorySectionProps & { sx?: SxProps<Theme> }

/**
 * @deprecated Not used anymore
 *
 * @param props
 * @returns
 */
export function ProductFiltersProAllFiltersSidebar(props: ProductFiltersProAllFiltersSidebarProps) {
  const { sort_fields, total_count, renderer, sx = [], category, params } = props

  return (
    <Box sx={[{ display: { xs: 'none', md: 'grid' } }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <ProductFiltersProCategorySection category={category} params={params} />
      <ProductFiltersProSortSection
        sort_fields={sort_fields}
        total_count={total_count}
        category={category}
      />
      <ProductFiltersProLimitSection />
      <ProductFiltersProAggregations
        renderer={{ ...productFiltersProSectionRenderer, ...renderer }}
      />
    </Box>
  )
}
