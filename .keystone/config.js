"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core3 = require("@keystone-6/core");

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "name createdAt",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// schema.ts
var import_core2 = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");

// custom-field/index.ts
var import_types = require("@keystone-6/core/types");
var import_core = require("@keystone-6/core");
function text({
  isIndexed,
  ...config2
} = {}) {
  return (meta) => (0, import_types.fieldType)({
    kind: "scalar",
    mode: "optional",
    scalar: "String",
    index: isIndexed === true ? "index" : isIndexed || void 0
  })({
    ...config2,
    input: {
      create: {
        arg: import_core.graphql.arg({ type: import_core.graphql.String }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        resolve(value, context) {
          return value;
        }
      },
      update: { arg: import_core.graphql.arg({ type: import_core.graphql.String }) },
      orderBy: { arg: import_core.graphql.arg({ type: import_types.orderDirectionEnum }) }
    },
    output: import_core.graphql.field({
      type: import_core.graphql.String,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      resolve({ value, item }, args, context, info) {
        return value;
      }
    }),
    views: "./custom-field/views",
    getAdminMeta() {
      return {};
    }
  });
}

// schema.ts
var import_fields = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var lists = {
  User: (0, import_core2.list)({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: import_access.allowAll,
    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: (0, import_fields.text)({
        validation: { isRequired: true }
      }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      // isAdmin: checkbox(),
      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      posts: (0, import_fields.relationship)({ ref: "Post.author", many: true }),
      createdAt: (0, import_fields.timestamp)({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" }
      })
    }
  }),
  Image: (0, import_core2.list)({
    fields: {
      name: (0, import_fields.text)({
        validation: {
          isRequired: true
        }
      }),
      image: (0, import_fields.image)({
        storage: "my_local_images"
      })
    },
    access: import_access.allowAll,
    ui: {
      isHidden: true
    }
  }),
  Post: (0, import_core2.list)({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: import_access.allowAll,
    // {
    //   operation: {
    //     query: allowAll,
    //     create: isAdmin,
    //     update: isAdmin,
    //     delete: isAdmin,
    //   },
    //   filter: {
    //     query: filterPosts,
    //   },
    // },
    // this is the fields for our Post list
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      publishedAt: (0, import_fields.timestamp)({ defaultValue: { kind: "now" } }),
      images: (0, import_fields.relationship)({
        ref: "Image",
        many: true
      }),
      customField: text({
        ui: {
          description: "Just for a practice"
        }
      }),
      status: (0, import_fields.select)({
        options: [
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" }
        ],
        defaultValue: "draft",
        ui: { displayMode: "segmented-control" }
      }),
      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      Description: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true
      }),
      // with this field, you can set a User as the author for a Post
      author: (0, import_fields.relationship)({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: "User.posts",
        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true
        },
        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false
      }),
      // with this field, you can add some Tags to Posts
      tags: (0, import_fields.relationship)({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: "Tag.posts",
        // a Post can have many Tags, not just one
        many: true,
        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] }
        }
      })
    }
  }),
  // this last list is our Tag list, it only has a name field for now
  Tag: (0, import_core2.list)({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: import_access.allowAll,
    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true
    },
    // this is the fields for our Tag list
    fields: {
      name: (0, import_fields.text)(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: (0, import_fields.relationship)({ ref: "Post.tags", many: true })
    }
  })
};

// keystone.ts
var baseUrl = "http://localhost:3000";
var keystone_default = withAuth(
  (0, import_core3.config)({
    db: {
      provider: "postgresql",
      url: "postgres://postgres:postgres@localhost:5432/keystone",
      onConnect: async (context) => {
        console.log("Connected Successfully");
      },
      // Optional advanced configuration
      enableLogging: true,
      idField: { kind: "uuid" },
      shadowDatabaseUrl: "postgres://postgres:postgres@localhost:5432/shadowdb"
    },
    server: {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:4000"],
        // Replace with the origin(s) allowed to access the server
        methods: ["GET", "POST", "PUT", "DELETE"],
        // Specify the HTTP methods allowed
        allowedHeaders: ["Content-Type", "Authorization"],
        // Specify the allowed request headers
        credentials: true
        // Allow cookies to be sent along with the requests
      }
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
          path: "/images"
        },
        storagePath: "public/images"
      }
    },
    session
  })
);
//# sourceMappingURL=config.js.map
