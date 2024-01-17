const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');
const cors = require('cors');
const fs = require('fs');

const RepositoryType = new GraphQLObjectType({
  name: 'Repository',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

let data = [];

// Read data from file on server start
fs.readFile('repositories.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.log('Error reading file:', err);
    return;
  }
  try {
    data = JSON.parse(jsonString);
  } catch (err) {
    console.log('Error parsing JSON:', err);
  }
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    repositories: {
      type: new GraphQLList(RepositoryType),
      args: {
        first: { type: GraphQLNonNull(GraphQLInt) },
        after: { type: GraphQLString },
      },
      resolve: (parent, { first, after }) => {
        const startIndex = after ? data.findIndex(item => item.id === after) + 1 : 0;
        const endIndex = startIndex + first;
        return data.slice(startIndex, endIndex);
      },
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addRepository: {
      type: RepositoryType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, { name, description }) => {
        const newRepo = {
          id: (data.length + 1).toString(),
          name,
          description,
        };

        data.push(newRepo);
        writeDataToFile();

        return newRepo;
      },
    },
    removeRepository: {
      type: RepositoryType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, { id }) => {
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
          const removedRepo = data.splice(index, 1)[0];
          writeDataToFile();
          return removedRepo;
        } else {
          throw new Error('Repository not found');
        }
      },
    },
    updateRepository: {
      type: RepositoryType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve: (parent, { id, name, description }) => {
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
          // Update the repository if the id is found
          if (name) data[index].name = name;
          if (description) data[index].description = description;
          writeDataToFile();
          return data[index];
        } else {
          throw new Error('Repository not found');
        }
      },
    },
  },
});

function writeDataToFile() {
  fs.writeFile('repositories.json', JSON.stringify(data, null, 2), 'utf8', (err) => {
    if (err) {
      console.log('Error writing file:', err);
    }
  });
}

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

const port = 4000;
app.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
});
