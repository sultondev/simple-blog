import { $fetch, FetchOptions } from "ofetch";

export function useCustomFetch(
  url: string | (() => string),
  options: FetchOptions = {},
) {
  return $fetch(url, {
    method: "GET",
    baseURL: "https://jsonplaceholder.typicode.com",
    ...options,
  });
}
