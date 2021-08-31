import avaprotected from 'src/configs/axios/protected'

export default {
   whatsappRotator: (payload) => avaprotected.post(`/channels/whatsapp/rotator`, payload),
   whatsappNumberList: () => avaprotected.get(`/whatsapp`),
   analytics: (payload) => avaprotected.post('/whatsapp/analytics', payload)
}
