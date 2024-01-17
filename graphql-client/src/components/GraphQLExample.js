import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './GraphQLExample.css';

const GET_SAMPLE_DATA = gql`
  query GetSampleData($first: Int!, $after: String) {
    repositories(first: $first, after: $after) {
      id
      name
      description
    }
  }
`;

const ADD_REPOSITORY = gql`
  mutation AddRepository($name: String!, $description: String!) {
    addRepository(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

const REMOVE_REPOSITORY = gql`
  mutation RemoveRepository($id: String!) {
    removeRepository(id: $id) {
      id
      name
      description
    }
  }
`;

const UPDATE_REPOSITORY = gql`
  mutation UpdateRepository($id: String!, $name: String, $description: String) {
    updateRepository(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

const ITEMS_PER_PAGE = 3;

const GraphQLExample = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingItem, setEditingItem] = useState(null);
 
  const { loading: queryLoading, error: queryError, data, fetchMore, refetch } = useQuery(GET_SAMPLE_DATA, {
    variables: { first: ITEMS_PER_PAGE, after: null }, // Ensure first is non-null
  });

  const [removeRepository] = useMutation(REMOVE_REPOSITORY, {
    update: (cache, { data: { removeRepository } }) => {
      refetch(); // Refetch the query to update the data immediately
    },
  });

  const [updateRepository] = useMutation(UPDATE_REPOSITORY, {
    update: (cache, { data: { updateRepository } }) => {
      refetch(); // Refetch the query to update the data immediately
    },
  });

  const handleUpdateRepository = (id, newName, newDescription) => {
    updateRepository({
      variables: {
        id,
        name: newName,
        description: newDescription,
      },
      refetchQueries: [{ query: GET_SAMPLE_DATA, variables: { first: ITEMS_PER_PAGE, after: null } }],
      onCompleted: () => {
        setName('')
        setDescription('')
        setEditingItem(null); // Reset editing mode after successful update
      },
    }).catch((error) => {
      console.error("Error updating repository:", error);
    });
  };

  const handleRemoveRepository = (id) => {
    removeRepository({
      variables: {
        id,
      },
    });
  };
  
  const loadMore = () => {
    if (data?.repositories.length > 0) {
      fetchMore({
        variables: { first: ITEMS_PER_PAGE, after: data.repositories[data.repositories.length - 1].id },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          return {
            repositories: [...prevResult.repositories, ...fetchMoreResult.repositories],
          };
        },
      });
    }
  };

  const [addRepository, { loading: mutationLoading, error: mutationError }] = useMutation(ADD_REPOSITORY, {
    update: (cache, { data: { addRepository } }) => {
      refetch(); // Refetch the query to update the data immediately
    },
  });

  const repositories = data?.repositories;

  const handleAddRepository = () => {
    if (!name || !description) {
      // Basic form validation
      alert('Please enter both repository name and description.');
      return;
    }
  
    addRepository({
      variables: {
        name,
        description,
      },
      update: (cache, { data: { addRepository: newRepo } }) => {
        // Update the cache with the new repository
        const existingRepos = cache.readQuery({
          query: GET_SAMPLE_DATA,
          variables: { first: ITEMS_PER_PAGE, after: null },
        });
  
        if (existingRepos) {
          cache.writeQuery({
            query: GET_SAMPLE_DATA,
            variables: { first: ITEMS_PER_PAGE, after: null },
            data: {
              repositories: [newRepo, ...existingRepos.repositories],
            },
          });
        }
      },
    });
  
    setName('');
    setDescription('');
  };

  return (
    <div className="graphql-example">
      <h1>Example Data from GraphQL</h1>
      <div className="add-repository-form">
        <input
          className='input'
          type="text"
          placeholder="Repository Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className='input'
          type="text"
          placeholder="Repository Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button onClick={handleAddRepository} disabled={mutationLoading}>
          Add Repository
        </button>
        {mutationError && <p className="error">Error adding repository!</p>}
      </div>
      <div className="repositories">
        {repositories?.map(item => (
          <div key={item.id} className={`repository ${editingItem === item.id ? 'editing' : ''}`}>
            {editingItem === item.id ? (
            <>
                <div>
                    <input
                    type="text"
                    placeholder="Type new name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="edit-input"
                    />
                </div>
                <div>
                    <textarea
                    placeholder="Type new description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="edit-input"
                    />
                </div>
                <div>
                    <button onClick={() => handleUpdateRepository(item.id, name, description)} className="save-button">
                    Save
                    </button>
                    <button onClick={() => setEditingItem(null)} className="edit-button">
                    Cancel
                    </button>
                </div>
            </>
            ) : (
              <>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <button onClick={() => setEditingItem(item.id)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleRemoveRepository(item.id)} className="remove-button">
                  Remove
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      {queryLoading && <p className="loading">Loading...</p>}
      {queryError && <p className="error">Error loading repositories!</p>}
      {data?.repositories.length > 0 && (
        <button onClick={loadMore} disabled={queryLoading}>
          Load More
        </button>
      )}
    </div>
  );
};

export default GraphQLExample;