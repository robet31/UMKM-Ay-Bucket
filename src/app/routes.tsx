import { createBrowserRouter } from "react-router";
import { Root } from "./layout";
import { Home } from "./pages/home";
import { CaseStudy } from "./pages/case-study";
import { Studio } from "./pages/studio";
import { Contact } from "./pages/contact";
import { Admin } from "./pages/admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "work/:slug", Component: CaseStudy },
      { path: "studio", Component: Studio },
      { path: "contact", Component: Contact },
      { path: "*", Component: Home },
    ],
  },
  {
    path: "/_admin",
    Component: Admin,
  },
]);
