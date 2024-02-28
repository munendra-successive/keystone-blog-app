// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from "@keystone-6/core";
import { session } from "./auth";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";
import { keystoneContext } from "./src/pages/keystone/context";
// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";
import { withAuth } from "./auth";

// const { withAuth } = createAuth({
//   listKey: "User",
//   identityField: "email",
//   secretField: "password",
//   sessionData: "isAdmin",
// });

// export const session = statelessSessions({
//   secret: "12345678901234567890123456789012",
// });

const baseUrl = "http://localhost:3000";

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      url: "postgres://postgres:postgres@localhost:5432/keystone",
      onConnect: async (context) => {
        /* ... */

        console.log("Connected Successfully");
      },

      // Optional advanced configuration

      enableLogging: true,
      idField: { kind: "uuid" },
      shadowDatabaseUrl: "postgres://postgres:postgres@localhost:5432/shadowdb",
    },

    server: {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:4000"], // Replace with the origin(s) allowed to access the server
        methods: ["GET", "POST", "PUT", "DELETE"], // Specify the HTTP methods allowed
        allowedHeaders: ["Content-Type", "Authorization"], // Specify the allowed request headers
        credentials: true, // Allow cookies to be sent along with the requests
      },
    },
    lists,
    storage: {
      // The key here will be what is referenced in the image field
      my_local_images: {
        // Images that use this store will be stored on the local machine
        kind: "local",
        // This store is used for the image field type
        type: "image",
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: (path) => `${baseUrl}/images${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: "/images",
        },
        storagePath: "public/images",
      },
    },
    session,
  })
);
