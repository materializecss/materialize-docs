import { globSync } from "glob";
import path, { resolve } from "path";
import handlebars from "vite-plugin-handlebars";
import { fileURLToPath } from "node:url";
import { config } from "./config.materialize";

let currentRoute = "";

function getMenuItem(item) {
  // Has kids?
  if (item.items) {
    // active kids?
    const kidsIds = item.items.map((el) => el.id);
    const kidsPages = config.pages.filter((page) => kidsIds.includes(page.id));
    const hasActiveKid = kidsPages.some(
      (kid) => currentRoute === "/" + kid.url
    );

    const activeClass = hasActiveKid ? "active" : "";
    return `<li>
      <ul class="collapsible collapsible-accordion">
        <li class="${activeClass}">
          <a class="collapsible-header waves-effect">
          ${item.icon ? `<span class="material-icons">${item.icon}</span>` : ""}
          ${item.name || ""}
          </a>
          <div class="collapsible-body">
            <ul>
              ${item.items.map((itm) => getMenuItem(itm)).join("")}
            </ul>
          </div>
        </li>
      </ul>
    </li>`;
  }

  // Merge
  let page = {};
  if (item.id) {
    page = config.pages.find((page) => page.id === item.id);
  }
  const merged = { ...page, ...item };

  // active
  const isActive = currentRoute === "/" + merged.url;
  const activeClass = isActive ? "active" : "";
  return `<li class="${activeClass}">
    <a href="${merged.url || "#"}">
    ${merged.icon ? `<span class="material-icons">${merged.icon}</span>` : ""}
    ${merged.name || "?"}</a>
  </li>`;
}

export default {
  base: "./",
  plugins: [
    handlebars({
      context(pagePath) {
        currentRoute = pagePath;
        const searchUrl = pagePath.substring(1);
        const index = config.pages.find((page) => page.url === "index.html");
        const page = config.pages.find((page) => page.url === searchUrl);
        // Use default Values if they are not set
        page.description = index.description;
        return { page, config };
      },
      helpers: {
        getmenu: function(item) {
          return getMenuItem(item);
        },
      },
      partialDirectory: resolve(__dirname, "partials"),
    }),
  ],
  build: {
    rollupOptions: {
      //this is needed for "vite publish" to include all html files, not only the index.
      input: Object.fromEntries(
        globSync("*.html").map((file) => [
          // This remove the file extension from each
          // file, so e.g. nested/foo.js becomes nested/foo
          file.slice(0, file.length - path.extname(file).length),
          // This expands the relative paths to absolute paths, so e.g.
          // src/nested/foo becomes /project/src/nested/foo.js
          fileURLToPath(new URL(file, import.meta.url)),
        ])
      ),
    },
  },
};
