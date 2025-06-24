import { config } from "../config.materialize";
import "./style.scss";
//import { argbFromHex, themeFromSourceColor } from "@material/material-color-utilities";
import { Themes } from "./themes";
import { autocompleteDemoData } from "./data-autocomplete";
import hljs from "highlight.js";
import {
  Autocomplete,
  Cards,
  Carousel,
  CharacterCounter,
  Chips,
  Collapsible,
  Datepicker,
  Dropdown,
  FloatingActionButton,
  FormSelect,
  Materialbox,
  Modal,
  Parallax,
  Pushpin,
  ScrollSpy,
  Sidenav,
  Slider,
  Tabs,
  TapTarget,
  Timepicker,
  Tooltip,
} from "@materializecss/materialize";

function importCodeStyle(isDarkMode) {
  if (isDarkMode) import("highlight.js/styles/atom-one-dark.min.css");
  else import("highlight.js/styles/atom-one-light.min.css");
}

function rgb2hex(rgb: string) {
  if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
  const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch === null) return "N/A";
  function hex(x: string) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgbMatch[1]) + hex(rgbMatch[2]) + hex(rgbMatch[3]);
}

// Detect touch screen and enable scrollbar if necessary
function is_touch_device() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}

function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderOrganizationMembers() {
  fetch("https://api.github.com/orgs/materializecss/members")
    .then((resp) => resp.json())
    .then((items) => {
      console.log(items);
      const elements = items.map((item) => {
        const div = document.createElement("div");
        div.setAttribute("style", "text-align: center; width: 150px;");
        div.innerHTML = `<img src="${item.avatar_url}" alt="" style="width: 100px;" class="circle responsive-img"/>
        <p>${item.login}</p>`;
        return div;
      });
      document.querySelector(".orga-members").replaceChildren(...elements);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const themes = new Themes(document);

  if (location.pathname.endsWith("about.html")) {
    renderOrganizationMembers();
  }

  // CSS > Colors
  document.querySelectorAll(".dynamic-color .col > div").forEach((el) => {
    const color = getComputedStyle(el).backgroundColor;
    const classesText = Array.from(el.classList).join(" ");
    (el as any).innerText = `${rgb2hex(color)} ${classesText}`;
    // swap text color
    if (classesText.indexOf("darken") >= 0 || el.classList.contains("black")) (el as any).style.color = "rgba(255,255,255,.87";
    else (el as any).style.color = "rgba(0, 0, 0, .87";
  });

  // Search Materialize Docs
  const searchInput = document.querySelector(".search-docs");
  if (searchInput) {
    const pages = config.pages.map((el) => ({
      id: el.id,
      text: el.name,
      description: el.description,
      url: el.url,
    }));
    Autocomplete.init(<HTMLInputElement>searchInput, {
      minLength: 1,
      data: pages,
      onAutocomplete: (items) => {
        if (items.length === 1) {
          const targetItem = items[0];
          document.location.href = targetItem["url"];
        }
      },
    });
  }

  // Github Latest Commit
  const githubCommitElem = document.querySelector(".github-commit");
  if (githubCommitElem != null) {
    // Checks if widget div exists (Index only)
    fetch("https://api.github.com/repos/materializecss/materialize/commits/main")
      .then((resp) => resp.json())
      .then((data) => {
        const url = data.html_url;
        const sha = data.sha.substring(0, 7);
        const date = data.commit.author.date;
        (githubCommitElem.querySelector(".date") as HTMLElement).innerText = date;
        (githubCommitElem.querySelector(".sha") as HTMLElement).innerText = sha;
        (githubCommitElem.querySelector(".sha") as HTMLLinkElement).href = url;
      });
  }

  // Floating-Fixed Table of Contents
  const tocWrapperHeight = 260; // Max height of ads.
  const socialHeight = 95; // Height of unloaded social media in footer.
  const tocElem = document.querySelector(".toc-wrapper .table-of-contents");
  const tocHeight = tocElem ? tocElem.getBoundingClientRect().height : 0;

  const footerElem = document.querySelector("body > footer");
  const footerOffset = footerElem ? footerElem.getBoundingClientRect().top - window.scrollY + document.documentElement.clientTop : 0;

  const bottomOffset = footerOffset - socialHeight - tocHeight - tocWrapperHeight;

  const nav = document.querySelector("nav");
  const indexBanner = document.querySelector("#index-banner");
  const tocWrappers = document.querySelectorAll(".toc-wrapper");

  if (Pushpin) {
    if (nav)
      Pushpin.init(tocWrappers, {
        top: nav.getBoundingClientRect().height,
        bottom: bottomOffset,
      });
    else if (indexBanner)
      Pushpin.init(tocWrappers, {
        top: indexBanner.getBoundingClientRect().height,
        bottom: bottomOffset,
      });
    else Pushpin.init(tocWrappers, { top: 0, bottom: bottomOffset });
  }

  // Toggle Flow Text
  const toggleFlowTextButton = document.querySelector("#flow-toggle");
  const flowDemoParagraphs = document.querySelectorAll("#flow-text-demo p");
  toggleFlowTextButton?.addEventListener("click", () => {
    flowDemoParagraphs.forEach((p) => {
      p.classList.toggle("flow-text");
    });
  });

  // Toggle Containers on page
  const toggleContainersButton = document.querySelector("#container-toggle-button");
  toggleContainersButton?.addEventListener("click", () => {
    document.querySelectorAll("body .browser-window .container, .had-container").forEach((el) => {
      el.classList.toggle("had-container");
      el.classList.toggle("container");
      const nextStateText = el.classList.contains("container") ? "off" : "on";
      (toggleContainersButton as HTMLElement).innerText = "Turn " + nextStateText + " Containers";
    });
  });

  // Set checkbox on forms.html to indeterminate
  const indeterminateCheckbox = document.getElementById("indeterminate-checkbox");
  if (indeterminateCheckbox !== null) (indeterminateCheckbox as any).indeterminate = true;
  const indeterminateCheckbox2 = document.getElementById("indeterminate-checkbox2");
  if (indeterminateCheckbox2 !== null) (indeterminateCheckbox2 as any).indeterminate = true;

  // CSS Transitions Demo Init
  const scaleDemoElem = document.querySelector("#scale-demo");
  const scaleDemoTriggerElem = document.querySelector("#scale-demo-trigger");
  if (scaleDemoElem && scaleDemoTriggerElem) {
    scaleDemoTriggerElem.addEventListener("click", () => {
      scaleDemoElem.classList.toggle("scale-out");
    });
  }

  // Pushpin Demo Init
  const pushPinDemoNavElems = document.querySelectorAll(".pushpin-demo-nav");
  pushPinDemoNavElems.forEach((navElem) => {
    const navBox = navElem.getBoundingClientRect();
    const contentElem = document.querySelector("#" + navElem.getAttribute("data-target"));
    const contentBox = contentElem.getBoundingClientRect();
    const offsetTop = Math.floor(contentBox.top + window.scrollY - document.documentElement.clientTop);
    Pushpin.init(<HTMLElement>navElem, {
      top: offsetTop,
      bottom: offsetTop + contentBox.height - navBox.height,
    });
  });

  // Mobile Overflow
  if (is_touch_device()) {
    (document.querySelector("#nav-mobile") as HTMLElement).style.overflow = "auto";
  }

  //---------------------------------------------------------------
  // Theme
  const isDarkMode = themes.isDarkMode();
  importCodeStyle(isDarkMode);
  themes.applyThemeProperties(isDarkMode);

  function setBtnState(isDark: boolean) {
    const themeSwitch = document.querySelector("#theme-switch");
    if (!themeSwitch) return;
    if (isDark) {
      themeSwitch.classList.add("is-dark");
      themeSwitch.querySelector("i").innerText = "light_mode";
      (themeSwitch as any).title = "Switch to light mode";
      return;
    }
    themeSwitch.classList.remove("is-dark");
    themeSwitch.querySelector("i").innerText = "dark_mode";
    (themeSwitch as any).title = "Switch to dark mode";
  }
  setBtnState(isDarkMode);

  const themeSwitch = document.querySelector("#theme-switch");
  themeSwitch?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!themeSwitch.classList.contains("is-dark")) {
      setBtnState(true);
      themes.setDarkMode();
    } else {
      setBtnState(false);
      themes.setLightMode();
    }
  });

  const toggleColorsButton = <HTMLInputElement>document.getElementById("color-picker");
  const themePrimaryColor = themes.getThemePrimaryColor();
  if (toggleColorsButton && themePrimaryColor) {
    toggleColorsButton.value = themePrimaryColor;
  }
  toggleColorsButton?.addEventListener("change", () => {
    themes.setThemePrimaryColor(toggleColorsButton.value);
  });

  document.querySelector("#downloadCss")?.addEventListener("click", () => {
    themes.downloadCss();
  });

  //---------------------------------------------------------------

  //------ Copy Button

  const copyBtn = Array.prototype.slice.call(document.querySelectorAll(".copyButton"));
  const copiedText = Array.prototype.slice.call(document.querySelectorAll(".copiedText"));
  const copyMsg = Array.prototype.slice.call(document.querySelectorAll(".copyMessage"));
  copyBtn.forEach((copyBtn, i) => {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(copiedText[i].innerText);
      copyMsg[i].style.opacity = 1;
      setTimeout(() => {
        copyMsg[i].style.opacity = 0;
      }, 2000);
    });
  });

  //------ Code Highlighting

  document.querySelectorAll("pre code").forEach((el: HTMLElement) => {
    const xmp = el.querySelector("xmp");
    if (xmp) el.innerHTML = escapeHtml(xmp.innerHTML);
    hljs.highlightElement(el);
  });

  //------  Materialize Components

  Cards.init(document.querySelectorAll(".card"));

  Carousel.init(document.querySelectorAll(".carousel"), {});
  Carousel.init(document.querySelectorAll(".carousel.carousel-slider"), {
    fullWidth: true,
    indicators: true,
    onCycleTo: () => {},
  });

  Collapsible.init(document.querySelectorAll(".collapsible"), {});
  Collapsible.init(document.querySelectorAll(".collapsible.expandable"), {
    accordion: false,
  });

  Dropdown.init(document.querySelectorAll(".dropdown-trigger"), {});
  Dropdown.init(document.querySelector("#dropdown-demo-left"), {
    alignment: "left",
    constrainWidth: false,
  });
  Dropdown.init(document.querySelector("#dropdown-demo-right"), {
    alignment: "right",
    constrainWidth: false,
  });

  Parallax.init(document.querySelectorAll(".parallax"), {});

  Materialbox.init(document.querySelectorAll(".materialboxed"), {});
  Slider.init(document.querySelectorAll(".slider"), {});

  Modal.init(document.querySelectorAll(".modal"), {});

  ScrollSpy.init(document.querySelectorAll(".scrollspy"), {});

  Datepicker.init(document.querySelectorAll(".datepicker"), {});

  Tabs.init(document.querySelectorAll(".tabs"), {});
  Tabs.init(document.querySelectorAll("#tabs-swipe-demo"), {
    swipeable: true,
  });

  Timepicker.init(document.querySelectorAll(".timepicker"), {});

  Tooltip.init(document.querySelectorAll(".tooltipped"), {});

  Sidenav.init(document.querySelectorAll(".sidenav"), {});

  const tts = TapTarget.init(document.querySelectorAll(".tap-target"), {});
  document.querySelector("#open-taptarget")?.addEventListener("click", () => tts[0].open());
  document.querySelector("#close-taptarget")?.addEventListener("click", () => tts[0].close());

  FormSelect.init(document.querySelectorAll("select:not(.disabled)"), {});

  CharacterCounter.init(document.querySelectorAll("[maxlength]"), {});

  Autocomplete.init(document.querySelectorAll("input.autocomplete"), {
    minLength: 0,
    data: autocompleteDemoData,
  });
  Autocomplete.init(document.querySelectorAll("input.autocomplete-multiple"), {
    isMultiSelect: true,
    minLength: 1,
    data: autocompleteDemoData,
  });

  Chips.init(document.querySelectorAll(".chips"), {});
  Chips.init(document.querySelectorAll(".chips-initial"), {
    data: autocompleteDemoData.filter((country) => ["ma", "ta", "er", "ia", "li", "ze"].includes(country.id)),
  });
  Chips.init(document.querySelectorAll(".chips-placeholder"), {
    placeholder: "Enter a tag",
    secondaryPlaceholder: "+Tag",
  });
  Chips.init(document.querySelectorAll(".chips-autocomplete"), {
    autocompleteOptions: {
      data: autocompleteDemoData,
    },
  });

  FloatingActionButton.init(document.querySelectorAll(".fixed-action-btn"), {});
  FloatingActionButton.init(document.querySelectorAll(".fixed-action-btn.horizontal"), {
    direction: "left",
  });
  FloatingActionButton.init(document.querySelectorAll(".fixed-action-btn.click-to-toggle"), {
    direction: "left",
    hoverEnabled: false,
  });
  FloatingActionButton.init(document.querySelectorAll(".fixed-action-btn.toolbar"), {
    toolbarEnabled: true,
  });
});
