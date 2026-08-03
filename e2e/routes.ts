/**
 * Single source of truth for the routes covered by the automated
 * accessibility + keyboard suites. Add a route here and it is
 * immediately enforced in CI.
 */
export const ROUTES = [
  { path: "/", name: "home" },
  { path: "/projects", name: "projects" },
  { path: "/post-project", name: "post-project" },
  { path: "/login", name: "login" },
  { path: "/profile-preview", name: "profile-preview" },
] as const;
