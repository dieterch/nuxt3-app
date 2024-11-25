import { CapacitorHttp } from "@capacitor/core";

interface FetchOptions {
  url?: string; // Will be dynamically assigned
  method?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  responseType?: "json" | "text" | "blob";
  timeout?: number;
}

export const useIFetch = () => {
  const baseurl = 'http://192.168.15.175:5678'; // config.public.SERVER_ADDRESS

  // GET request
  const get = async <T = any>(url: string): Promise<T> => {
    const response = await CapacitorHttp.get({
      url: baseurl + url,
    });
    return response.data as T;
  };

  // POST request
  const post = async <T = any>(url: string, options: FetchOptions): Promise<T> => {
    const response = await CapacitorHttp.post({
      ...options,
      url: baseurl + url,
    });
    return response.data as T;
  };

  // PUT request
  const put = async <T = any>(url: string, options: FetchOptions): Promise<T> => {
    const response = await CapacitorHttp.put({
      ...options,
      url: baseurl + url,
    });
    return response.data as T;
  };

  // DELETE request
  const del = async <T = any>(url: string, options: FetchOptions = {}): Promise<T> => {
    const response = await CapacitorHttp.delete({
      ...options,
      url: baseurl + url,
    });
    return response.data as T;
  };

  // Generic request
  const request = async <T = any>(url: string, options: FetchOptions): Promise<T> => {
    const response = await CapacitorHttp.request({
      ...options,
      url: baseurl + url,
    });
    return response.data as T;
  };

  return {
    get,
    post,
    put,
    del,
    request,
  };
};
