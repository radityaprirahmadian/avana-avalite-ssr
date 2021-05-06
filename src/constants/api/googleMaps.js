import googleApi from 'src/configs/axios/google';

export default {
  getLongLatByPostCode: ({ params }) => googleApi.get('/geocode/json',
    {
      params: {
        address: params.address,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS
      }
    }
  ),
  getAddressByLongLat: ({ params }) => googleApi.get(`/geocode/json`,
    {
      params: {
        latlng: `${params.lat},${params.lng}`,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS,
      }
    }
  )
}
