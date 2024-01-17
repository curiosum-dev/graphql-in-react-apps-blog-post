// App.js
import React from 'react';
import GraphQLExample from './components/GraphQLExample';
import { ApolloProvider } from '@apollo/client';
import client from './apollo';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <GraphQLExample />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
