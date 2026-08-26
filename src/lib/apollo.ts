import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "https://devapi.waltonplaza.com.bd/graphql";

export function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: endpoint,
      fetch: (input, init) => fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "User-Agent": "Mozilla/5.0",
        },
      }),
    }),
  });
}
