export const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Users",
      schema: [
        { id: "users-id", title: "id", key: "PK", type: "INT" },
        { id: "users-username", title: "username", type: "VARCHAR(50)" }, // UNIQUE (not PK)
        { id: "users-email", title: "email", type: "VARCHAR(100)" },
        {
          id: "users-password_hash",
          title: "password_hash",
          type: "VARCHAR(255)",
        },
        { id: "users-created_at", title: "created_at", type: "TIMESTAMP" },
      ],
    },
  },
  {
    id: "2",
    position: { x: 350, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Posts",
      schema: [
        { id: "posts-id", title: "id", key: "PK", type: "INT" },
        { id: "posts-user_id", title: "user_id", key: "FK", type: "INT" },
        { id: "posts-title", title: "title", type: "VARCHAR(255)" },
        { id: "posts-slug", title: "slug", type: "VARCHAR(255)" },
        { id: "posts-excerpt", title: "excerpt", type: "TEXT" },
        { id: "posts-content", title: "content", type: "TEXT" },
        { id: "posts-status", title: "status", type: "VARCHAR(30)" }, // e.g. draft/published
        { id: "posts-created_at", title: "created_at", type: "TIMESTAMP" },
        { id: "posts-updated_at", title: "updated_at", type: "TIMESTAMP" },
        { id: "posts-published_at", title: "published_at", type: "TIMESTAMP" },
      ],
    },
  },
  {
    id: "3",
    position: { x: 700, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Categories",
      schema: [
        { id: "categories-id", title: "id", key: "PK", type: "INT" },
        { id: "categories-name", title: "name", type: "VARCHAR(50)" },
        { id: "categories-slug", title: "slug", type: "VARCHAR(80)" },
        {
          id: "categories-parent_id",
          title: "parent_id",
          key: "FK",
          type: "INT",
        }, // optional hierarchy
      ],
    },
  },
  {
    id: "4",
    position: { x: 350, y: 260 },
    type: "databaseSchema",
    data: {
      label: "Comments",
      schema: [
        { id: "comments-id", title: "id", key: "PK", type: "INT" },
        { id: "comments-post_id", title: "post_id", key: "FK", type: "INT" },
        { id: "comments-user_id", title: "user_id", key: "FK", type: "INT" },
        {
          id: "comments-parent_comment_id",
          title: "parent_comment_id",
          key: "FK",
          type: "INT",
        },
        { id: "comments-content", title: "content", type: "TEXT" },
        { id: "comments-created_at", title: "created_at", type: "TIMESTAMP" },
      ],
    },
  },
  {
    id: "5",
    position: { x: 700, y: 260 },
    type: "databaseSchema",
    data: {
      label: "PostCategories",
      schema: [
        {
          id: "postcategories-post_id",
          title: "post_id",
          key: "PK",
          type: "INT",
        }, // also FK
        {
          id: "postcategories-category_id",
          title: "category_id",
          key: "PK",
          type: "INT",
        }, // also FK
        {
          id: "postcategories-created_at",
          title: "created_at",
          type: "TIMESTAMP",
        },
      ],
    },
  },
];

export const initialEdges = [
  // Users → Posts
  {
    data: {},
    id: "e1-2",
    source: "1",
    sourceHandle: "users-id-right",
    target: "2",
    targetHandle: "posts-user_id-left",
    type: "superCurvyEdge",
    markerStart: "one-start",
    markerEnd: "many-end",
  },
  // Posts → Comments
  {
    data: {},
    id: "e2-4",
    source: "2",
    sourceHandle: "posts-id-right",
    target: "4",
    targetHandle: "comments-post_id-left",
    type: "superCurvyEdge",
    markerStart: "one-start",
    markerEnd: "many-end",
  },
  // Users → Comments
  {
    data: {},
    id: "e1-4",
    source: "1",
    sourceHandle: "users-id-right",
    target: "4",
    targetHandle: "comments-user_id-left",
    type: "superCurvyEdge",
    markerStart: "one-start",
    markerEnd: "many-end",
  },
  // Categories (self) → Categories (parent)
  {
    data: {},
    id: "e3-3",
    source: "3",
    sourceHandle: "categories-id-right",
    target: "3",
    targetHandle: "categories-parent_id-left",
    type: "superCurvyEdge",
    markerStart: "one-start",
    markerEnd: "many-end",
  },
  // Posts → PostCategories
  {
    data: {},
    id: "e2-5",
    source: "2",
    sourceHandle: "posts-id-right",
    target: "5",
    targetHandle: "postcategories-post_id-left",
    type: "superCurvyEdge",
    markerStart: "one-start",
    markerEnd: "many-end",
  },
  // Categories → PostCategories
  {
    data: {},
    id: "e3-5",
    source: "3",
    sourceHandle: "categories-id-right",
    target: "5",
    targetHandle: "postcategories-category_id-left",
    type: "superCurvyEdge",
    markerStart: "one-start",
    markerEnd: "many-end",
  },
];
