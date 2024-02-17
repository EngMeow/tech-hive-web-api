API Features Report
Introduction
The purpose of this report is to provide an overview of the key features and components of the API implemented in the index.ts file. The API is built using the Express.js framework and incorporates various middleware for enhanced security, logging, and error handling.

Key Features
1. Express.js Framework
The API is built on the Express.js framework, a widely used Node.js web application framework. Express simplifies the creation of robust APIs by providing a set of features and tools for routing, middleware, and HTTP utility methods.

2. Middleware
a. Logging with Morgan
The API utilizes the morgan middleware for logging HTTP requests. This provides detailed information about incoming requests, facilitating debugging and performance analysis.

b. CORS Handling with Cors
Cross-Origin Resource Sharing (CORS) is handled using the cors middleware, allowing specified origins (e.g., 'http://localhost:3000') to access resources on the server. Credentials are also allowed for a secure communication setup.

c. Security with Helmet
Helmet middleware enhances API security by setting various HTTP headers, such as Content Security Policy (CSP) and Cross-Origin Resource Policy.

d. Preventing HTTP Parameter Pollution with HPP
The hpp middleware helps prevent HTTP Parameter Pollution attacks by removing repeated parameters and only using the last occurrence.

e. Compression with Compression
The API response payload is compressed using the compression middleware, reducing the data transferred over the network and improving performance.

f. Cookie Parsing with Cookie-Parser
The cookie-parser middleware is used for parsing cookies attached to incoming requests.

3. File Uploads
Static file serving for uploads is implemented using Express's static middleware. Files are served from the '/static' endpoint, and the directory structure is configured accordingly.

4. Modular Routing
The API is structured with modular routing using separate route handlers for authentication (authRouter) and user-related operations (userRouter).

5. Error Handling
Custom error handling is implemented using the AppError class. Any undefined routes trigger a 404 error, and unhandled errors result in a 500 Internal Server Error response.

Conclusion
The API implemented in index.ts incorporates key features to ensure security, performance, and maintainability. The use of Express.js and various middleware enhances the overall functionality and robustness of the API.
