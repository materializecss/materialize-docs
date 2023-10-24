import { globSync } from "glob";
import path, { resolve } from "path";
import handlebars from "vite-plugin-handlebars";
import { fileURLToPath } from "node:url";

const config = {
  currentRoute: "",
  items: [
    {
      url: "about.html",
      name: "About",
      description: "Learn about Material Design and our Project Team.",
      icon: "info",
    },
    {
      url: "getting-started.html",
      name: "Getting started",
      icon: "apps",
    },
    {
      name: "Styles",
      icon: "palette",
      items: [
        { url: "color.html", name: "Color" },
        { url: "grid.html", name: "Grid" },
        { url: "helpers.html", name: "Helpers" },
        { url: "media-css.html", name: "Media" },
        { url: "pulse.html", name: "Pulse" },
        { url: "sass.html", name: "Sass" },
        { url: "shadow.html", name: "Shadow" },
        { url: "table.html", name: "Table" },
        { url: "css-transitions.html", name: "Transitions" },
        { url: "typography.html", name: "Typography" },
        { url: "themes.html", name: "Themes" },
        { url: "waves.html", name: "Waves" },
      ],
    },
    {
      name: "Components",
      icon: "add_circle",
      items: [
        { url: "badges.html", name: "Badges" },
        { url: "buttons.html", name: "Buttons" },
        { url: "breadcrumbs.html", name: "Breadcrumbs" },
        { url: "cards.html", name: "Cards" },
        { url: "collections.html", name: "Collections" },
        { url: "floating-action-button.html", name: "Floating Action Button" },
        { url: "footer.html", name: "Footer" },
        { url: "icons.html", name: "Icons" },
        { url: "navbar.html", name: "Navbar" },
        { url: "pagination.html", name: "Pagination" },
        { url: "preloader.html", name: "Preloader" },
        { url: "auto-init.html", name: "Auto Init" },
        { url: "carousel.html", name: "Carousel" },
        { url: "collapsible.html", name: "Collapsible" },
        { url: "dropdown.html", name: "Dropdown" },
        { url: "feature-discovery.html", name: "Feature Discovery" },
        { url: "media.html", name: "Media" },
        { url: "modals.html", name: "Modals" },
        { url: "parallax.html", name: "Parallax" },
        { url: "pushpin.html", name: "Pushpin" },
        { url: "scrollspy.html", name: "Scrollspy" },
        { url: "sidenav.html", name: "Sidenav" },
        { url: "tabs.html", name: "Tabs" },
        { url: "toasts.html", name: "Toasts" },
        { url: "tooltips.html", name: "Tooltips" },
      ],
      badges: { url: "/badges.html", name: "Badges" },
      grid: { url: "/grid.html", name: "Grid" },
    },
    {
      name: "Forms",
      icon: "text_fields",
      items: [
        { url: "autocomplete.html", name: "Autocomplete" },
        { url: "checkboxes.html", name: "Checkboxes" },
        { url: "chips.html", name: "Chips" },
        { url: "pickers.html", name: "Pickers" },
        { url: "radio-buttons.html", name: "Radio Buttons" },
        { url: "range.html", name: "Range" },
        { url: "select.html", name: "Select" },
        { url: "switches.html", name: "Switches" },
        { url: "text-inputs.html", name: "Text Inputs" },
      ],
    },
    {
      url: "mobile.html",
      name: "Mobile",
      icon: "mobile_friendly",
    },
  ],
};

export default {
  base: "./",
  plugins: [
    handlebars({
      context(pagePath) {
        config.currentRoute = pagePath;
        return config;
      },
      helpers: {
        lookup: function(item) {
          return item.items ? "menucollapsible" : "menuitem";
        },
        icon: function() {
          if (!this.icon) return "";
          return `<span class="material-icons">${this.icon}</span>`;
        },
        isActive: function(ctx) {
          const currentRoute = ctx.data.root.currentRoute;
          // child element?
          if (this.items) {
            const isChild = this.items.some(
              (e) => currentRoute === "/" + e.url
            );
            if (isChild) return "active";
          }
          // self?
          return currentRoute === "/" + this.url ? "active" : "";
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
