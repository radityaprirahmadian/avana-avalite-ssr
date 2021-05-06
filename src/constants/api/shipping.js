import avaprotected from 'src/configs/axios/protected'

export default {
   getDestination: (options) => avaprotected.get(`/shipping/courier/jne-destination`, {
      params: { ...options?.params }
   }),
   getRate: (options) => avaprotected.get(`/shipping-rate`, {
      params: { ...options?.params }
   }),
   getRateByState: (options) => avaprotected.get(`/shipping-rate-by-state/${options?.stateId}`, {
      params: { ...options?.params }
   }),
   getCouriers: () => avaprotected.get(`/shipper/logistic-city`),
   getServices: (options) => avaprotected.get(`/shipper/rates`, {
      params: { ...options?.params }
   }),
}
