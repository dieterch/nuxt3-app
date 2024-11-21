import { Capacitor, CapacitorHttp } from "@capacitor/core";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const baseurl = config.public.SERVER_ADDRESS
  const ifetch = {
    get: async (url: string) => {
        const response = await CapacitorHttp.get({
          url: baseurl + url,
        });
        return response.data
    },
    //@ts-ignore
    post: async ( url, options ) => {
      options.url = baseurl + url;
      const response = await CapacitorHttp.post( options );
      return response.data
    },
    //@ts-ignore
    delete: async ( url, options ) => {
      options.url = baseurl + url
      const response = await CapacitorHttp.delete( options )
      return response.data
    },
  };

  return {
    provide: {
      ifetch,
    },
  };
});
