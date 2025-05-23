export const config = {
  pages: [
    {
      id: "index",
      url: "index.html",
      name: "Documentation",
      description: "Materialize is a modern responsive CSS framework based on Material Design by Google.",
    },
    {
      id: "about",
      url: "about.html",
      name: "About",
      description: "Learn about Material Design and our Project Team.",
    },
    {
      id: "gettingstarted",
      url: "getting-started.html",
      name: "Getting started",
      description: "Learn how to easily start using Materialize and integrate it into your project.",
    },
    {
      id: "color",
      url: "color.html",
      name: "Color",
      description: "Materialize offers a lot of colors which can be used in your next project.",
    },
    {
      id: "grid",
      url: "grid.html",
      name: "Grid",
      description: "Use Materializes powerful grid system which uses CSS Grid to make formatting your web project easier and more comfortable.",
    },
    {
      id: "helpers",
      url: "helpers.html",
      name: "Helpers",
      description: "Get an overview of all helper classes for visibility and common css properties.",
    },
    {
      id: "mediacss",
      url: "media-css.html",
      name: "Media Styles",
      description: "Responsive images and videos ready to be seen on many devices.",
    },
    { id: "pulse", url: "pulse.html", name: "Pulse" },
    { id: "sass", url: "sass.html", name: "Sass" },
    { id: "shadow", url: "shadow.html", name: "Shadow" },
    { id: "table", url: "table.html", name: "Table" },
    { id: "transitions", url: "css-transitions.html", name: "Transitions" },
    { id: "typography", url: "typography.html", name: "Typography" },
    { id: "themes", url: "themes.html", name: "Themes" },
    { id: "waves", url: "waves.html", name: "Waves" },
    { id: "badges", url: "badges.html", name: "Badges" },
    { id: "buttons", url: "buttons.html", name: "Buttons" },
    { id: "breadcrumbs", url: "breadcrumbs.html", name: "Breadcrumbs" },
    { id: "cards", url: "cards.html", name: "Cards" },
    { id: "collections", url: "collections.html", name: "Collections" },
    {
      id: "floatingactionbutton",
      url: "floating-action-button.html",
      name: "Floating Action Button",
    },
    { id: "footer", url: "footer.html", name: "Footer" },
    { id: "icons", url: "icons.html", name: "Icons" },
    { id: "navbar", url: "navbar.html", name: "Navbar" },
    { id: "pagination", url: "pagination.html", name: "Pagination" },
    { id: "preloader", url: "preloader.html", name: "Preloader" },
    { id: "autoinit", url: "auto-init.html", name: "Auto Init" },
    { id: "carousel", url: "carousel.html", name: "Carousel" },
    { id: "collapsible", url: "collapsible.html", name: "Collapsible" },
    { id: "dropdown", url: "dropdown.html", name: "Dropdown" },
    {
      id: "featurediscovery",
      url: "feature-discovery.html",
      name: "Feature Discovery",
    },
    {
      id: "media",
      url: "media.html",
      name: "Media",
      description: "Use Box and Slider to present your media content in a cool way.",
    },
    { id: "modals", url: "modals.html", name: "Modals" },
    { id: "parallax", url: "parallax.html", name: "Parallax" },
    { id: "pushpin", url: "pushpin.html", name: "Pushpin" },
    { id: "scrollspy", url: "scrollspy.html", name: "Scrollspy" },
    { id: "sidenav", url: "sidenav.html", name: "Sidenav" },
    { id: "tabs", url: "tabs.html", name: "Tabs" },
    { id: "toasts", url: "toasts.html", name: "Toasts" },
    { id: "tooltips", url: "tooltips.html", name: "Tooltips" },
    { id: "autocomplete", url: "autocomplete.html", name: "Autocomplete" },
    { id: "checkboxes", url: "checkboxes.html", name: "Checkboxes" },
    { id: "chips", url: "chips.html", name: "Chips" },
    {
      id: "pickers",
      url: "pickers.html",
      name: "Pickers",
      description: "Controlling inputs in a more easy way and send date and time along with your form.",
    },
    {
      id: "datepicker",
      url: "datepicker.html",
      name: "Date Picker",
      description: "Select single or multiple dates, ranges and more.",
    },
    {
      id: "timepicker",
      url: "timepicker.html",
      name: "Time Picker",
      description: "Select a single time with the support of the awesome Timepicker.",
    },
    { id: "radiobuttons", url: "radio-buttons.html", name: "Radio Buttons" },
    { id: "range", url: "range.html", name: "Range" },
    { id: "select", url: "select.html", name: "Select" },
    { id: "switches", url: "switches.html", name: "Switches" },
    { id: "textinputs", url: "text-inputs.html", name: "Text Inputs" },
    { id: "mobile", url: "mobile.html", name: "Mobile" },
  ],

  // Navigation Menu as Tree Structure

  items: [
    { id: "about", icon: "info" },
    { id: "gettingstarted", icon: "apps" },
    {
      name: "Styles",
      icon: "palette",
      items: [
        { id: "color" },
        { id: "grid" },
        { id: "helpers" },
        { id: "mediacss" },
        { id: "pulse" },
        { id: "sass" },
        { id: "shadow" },
        { id: "table" },
        { id: "transitions" },
        { id: "typography" },
        { id: "themes" },
        { id: "waves" },
      ],
    },
    {
      name: "Components",
      icon: "add_circle",
      items: [
        { id: "badges" },
        { id: "buttons" },
        { id: "breadcrumbs" },
        { id: "cards" },
        { id: "collections" },
        { id: "floatingactionbutton" },
        { id: "footer" },
        { id: "icons" },
        { id: "navbar" },
        { id: "pagination" },
        { id: "preloader" },
        { id: "autoinit" },
        { id: "carousel" },
        { id: "collapsible" },
        { id: "dropdown" },
        { id: "featurediscovery" },
        { id: "media" },
        { id: "modals" },
        { id: "parallax" },
        { id: "pushpin" },
        { id: "scrollspy" },
        { id: "sidenav" },
        { id: "tabs" },
        { id: "toasts" },
        { id: "tooltips" },
        { id: "datepicker" },
        { id: "timepicker" },
      ],
    },
    {
      name: "Forms",
      icon: "text_fields",
      items: [{ id: "autocomplete" }, { id: "checkboxes" }, { id: "chips" }, { id: "radiobuttons" }, { id: "range" }, { id: "select" }, { id: "switches" }, { id: "textinputs" }],
    },
    { id: "mobile", icon: "mobile_friendly" },
  ],
};
