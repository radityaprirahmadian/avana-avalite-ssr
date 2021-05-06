import avaprotected from 'src/configs/axios/protected'

export default {
   calculate: (payload) => avaprotected.post(`/calculate-coupon`, payload)
}
