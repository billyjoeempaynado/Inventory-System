import dashboard from "./views/dashboard.js";
import products from "./views/products.js";
import orders from "./views/orders.js";
import suppliers from "./views/supplier.js"; 
import logs from "./views/log.js"; 
import reports from "./views/reports.js"; 
import inventorylevel from "./views/inventorylevel.js"; 

export const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

export const router = async () => {
  const routes = [
    { path: "/users/dashboard", view: dashboard },
    { path: "/users/products", view: products },
    { path: "/users/orders", view: orders },
    { path: "/users/suppliers", view: suppliers },
    { path: "/users/logs", view: logs }, 
    { path: "/users/reports", view: reports }, 
    { path: "/users/inventorylevel", view: inventorylevel }, 
  ];

  const potentialMatches = routes.map((route) => ({
    route: route,
    isMatch: location.pathname === route.path,
  }));

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }

  const view = new match.route.view();
  document.querySelector("#content").innerHTML = await view.getHtml();
};

// Handle popstate for browser navigation
window.addEventListener("popstate", router);
