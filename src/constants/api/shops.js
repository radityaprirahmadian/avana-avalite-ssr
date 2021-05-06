import avapublic from 'src/configs/axios/public'
import avaprotected, {
   setAuthorization,
   setBaseUrl,
} from 'src/configs/axios/protected'
export default {
   oAuth: (slug) =>
      avapublic.get(`/channel/avalite/${slug}`).then((res) => res),
   details: (data) => {
      setBaseUrl(data.id)
      setAuthorization(data.token)
      return avaprotected.get(``).then((res) => res)
   },
}
