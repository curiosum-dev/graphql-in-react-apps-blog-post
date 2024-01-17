// apollo.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Update the URI to your local server
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer YOUR_LOCAL_SERVER_ACCESS_TOKEN`, // Optional: If you decide to implement authentication
  },
});

export default client;
