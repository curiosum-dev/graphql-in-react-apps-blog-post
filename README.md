# GraphQL React Demo

This is a simple project demonstrating how to build a GraphQL application with React and Node.js using Apollo Client and Apollo Server. The project includes basic CRUD operations for managing repositories.

## Getting Started

### Prerequisites

- Node.js and npm (or yarn) installed on your machine.

### Installation and running

1. Clone the repository:

   ```bash
   git clone https://github.com/curiosum-dev/graphql-in-react-apps-blog-post.git
   ```
2. Navigate to the server and client directories and install dependencies:

    ```
        cd graphql-in-react-apps-blog-post/graphql-server
        npm install

        cd graphql-in-react-apps-blog-post/graphql-client
        npm install
    ```

3. Start GraphQL server:

   ```
       cd graphql-server
       node server.js
   ```
   The GraphQL server will run at http://localhost:4000/graphql.

4. Start React client:
   ```
       cd graphql-client
       npm start
   ```
   The React app will be accessible at http://localhost:3000.

### Usage
Open your browser and navigate to http://localhost:3000 to interact with the GraphQL-powered React application.

Explore the functionality to add, update, and remove repositories.

### Contributing

Contributions are welcome! Feel free to open issues or pull requests.

### License

This project is licensed under the MIT License.