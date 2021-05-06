import avaprotected from 'src/configs/axios/protected'

export default {
   meta: (options) => avaprotected.get(`/meta/order`, {
      params: { ...options?.params }
   }),
   details: ({ orderId }) => avaprotected.get(`/orders/${orderId}`),
   create: (payload) => avaprotected.post(`orders`, payload),
   update: (orderId, payload) => avaprotected.put(`/orders/${orderId}`, payload),
}
