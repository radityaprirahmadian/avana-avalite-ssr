import avaprotected from 'src/configs/axios/protected'

export default {
   all: (options) =>
      avaprotected.get(`/products`, {
         ...options,
         params: {
            published: 1,
            sortKey: '',
            sortValue: 'asc',
            limit: '10',
            search: '',
            ...options.params,
         },
      }),

   categories: () => avaprotected.get(`/product-categories`),
}
