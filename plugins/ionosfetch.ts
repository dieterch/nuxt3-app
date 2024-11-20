import { Capacitor, CapacitorHttp } from "@capacitor/core";

export default defineNuxtPlugin(() => {
  const ifetch = {
    get: async (lurl: string) => {
      if (Capacitor.isNativePlatform()) {
        console.log(`Capacitor running on ${Capacitor.getPlatform()}`)
        return CapacitorHttp.get({
          url: lurl,
        });
      } else {
        console.log(`Capacitor running on ${Capacitor.getPlatform()}`)
        return $fetch(lurl);
      }
    },
    post: async (url: string) => {
      console.log("$ifetch.post not yet implemented");
    },
  };

  return {
    provide: {
      ifetch,
    },
  };
});
