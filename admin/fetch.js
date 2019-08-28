const fetchIsFunction = typeof fetch === "function";

export default function httpFetch() {
  if (fetchIsFunction) {
    return fetch.apply(this, arguments);
  } else {
    return Promise.reject("fetch() is not implemented in this JavaScript environment");
  }
}