import { M } from "@materializecss/materialize";
import Prism from "prismjs";
import "./style.scss";
import "prismjs/themes/prism.min.css";
import { config } from "../config.materialize";
import { argbFromHex, themeFromSourceColor, applyTheme } from "@material/material-color-utilities";
import { setThemeProperties } from "./themes";


globalThis.M = M  

document.addEventListener("DOMContentLoaded", function() {
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

  // CSS > Colors
  document.querySelectorAll(".dynamic-color .col > div").forEach((el) => {
    const color = getComputedStyle(el).backgroundColor;
    const classesText = Array.from(el.classList).join(" ");
    (el as any).innerText = `${rgb2hex(color)} ${classesText}`;
    // swap text color
    if (classesText.indexOf("darken") >= 0 || el.classList.contains("black"))
      (el as any).style.color = "rgba(255,255,255,.87";
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
    M.Autocomplete.init(searchInput, {
      minLength: 1,
      data: pages,
      onAutocomplete: (items) => {
        if (items.length === 1) {
          const targetItem = items[0];
          document.location.href = targetItem.url;
        }
      },
    });
  }

  // Github Latest Commit
  const githubCommitElem = document.querySelector(".github-commit");
  if (githubCommitElem != null) {
    // Checks if widget div exists (Index only)
    fetch(
      "https://api.github.com/repos/materializecss/materialize/commits/main"
    )
      .then((resp) => resp.json())
      .then((data) => {
        const url = data.html_url;
        const sha = data.sha;
        const date = data.commit.author.date;
        (githubCommitElem.querySelector(
          ".date"
        ) as HTMLElement).innerText = date;
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
  const footerOffset = footerElem
    ? footerElem.getBoundingClientRect().top -
      window.scrollY +
      document.documentElement.clientTop
    : 0;

  const bottomOffset =
    footerOffset - socialHeight - tocHeight - tocWrapperHeight;

  const nav = document.querySelector("nav");
  const indexBanner = document.querySelector("#index-banner");
  const tocWrappers = document.querySelectorAll(".toc-wrapper");

  if (M.Pushpin) {
    if (nav)
      M.Pushpin.init(tocWrappers, {
        top: nav.getBoundingClientRect().height,
        bottom: bottomOffset,
      });
    else if (indexBanner)
      M.Pushpin.init(tocWrappers, {
        top: indexBanner.getBoundingClientRect().height,
        bottom: bottomOffset,
      });
    else M.Pushpin.init(tocWrappers, { top: 0, bottom: bottomOffset });
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
  const toggleContainersButton = document.querySelector(
    "#container-toggle-button"
  );
  toggleContainersButton?.addEventListener("click", () => {
    document
      .querySelectorAll("body .browser-window .container, .had-container")
      .forEach((el) => {
        el.classList.toggle("had-container");
        el.classList.toggle("container");
        const nextStateText = el.classList.contains("container") ? "off" : "on";
        (toggleContainersButton as HTMLElement).innerText =
          "Turn " + nextStateText + " Containers";
      });
  });

  // Set checkbox on forms.html to indeterminate
  const indeterminateCheckbox = document.getElementById(
    "indeterminate-checkbox"
  );
  if (indeterminateCheckbox !== null)
    (indeterminateCheckbox as any).indeterminate = true;

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
    const contentElem = document.querySelector(
      "#" + navElem.getAttribute("data-target")
    );
    const contentBox = contentElem.getBoundingClientRect();
    const offsetTop = Math.floor(
      contentBox.top + window.scrollY - document.documentElement.clientTop
    );
    M.Pushpin.init(navElem, {
      top: offsetTop,
      bottom: offsetTop + contentBox.height - navBox.height,
    });
  });

  // Mobile Overflow
  if (is_touch_device()) {
    (document.querySelector("#nav-mobile") as HTMLElement).style.overflow =
      "auto";
  }

  // Theme
  const theme = localStorage.getItem("theme");
  const themeColor = localStorage.getItem('theme-color');
  const themeSwitch = document.querySelector("#theme-switch");
  const setTheme = (isDark) => {
    if (isDark) {
      themeSwitch.classList.add("is-dark");
      themeSwitch.querySelector("i").innerText = "light_mode";
      (themeSwitch as any).title = "Switch to light mode";
    } else {
      themeSwitch.classList.remove("is-dark");
      themeSwitch.querySelector("i").innerText = "dark_mode";
      (themeSwitch as any).title = "Switch to dark mode";
    }
    let themeColor = localStorage.getItem('theme-color');
    if (!themeColor)
      themeColor = "#006495"
    const color = argbFromHex(themeColor)
    
    const atheme = themeFromSourceColor(color)
    applyTheme(atheme, {target: document.body, dark: isDark, brightnessSuffix: true})
    setThemeProperties(document.body)
  };
  const setThemeColor = (colorStr) => {
    localStorage.setItem('theme-color', colorStr)
    const color = argbFromHex(colorStr)
    
    const atheme = themeFromSourceColor(color)
    
    // Print out the theme as JSON
    console.log(JSON.stringify(atheme, null, 2))
    
    // Check if the user has dark mode turned on
    //const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const theme = localStorage.getItem("theme");    
    
    // Apply the theme to the body by updating custom properties for material tokens
    //applyTheme(atheme, {target: document.body, dark: true, brightnessSuffix: true})
    applyTheme(atheme, {target: document.body, dark: theme != null, brightnessSuffix: true})
    setThemeProperties(document.body)
  }
  if (themeSwitch) {
    // Load
    if (theme) setTheme(true);
    if (themeColor) setThemeColor(themeColor)
    // Change
    themeSwitch.addEventListener("click", (e) => {
      e.preventDefault();
      if (!themeSwitch.classList.contains("is-dark")) {
        // Dark Theme
        document.documentElement.setAttribute("theme", "dark");
        localStorage.setItem("theme", "dark");
        setTheme(true);
      } else {
        // Light Theme
        document.documentElement.removeAttribute("theme");
        localStorage.removeItem("theme");
        setTheme(false);
      }
    });
  }
  const toggleColorsButton = <HTMLInputElement> document.getElementById('color-picker');
  if (toggleColorsButton && themeColor) {
    toggleColorsButton.value = themeColor
  }
  toggleColorsButton?.addEventListener('change', () => {
    setThemeColor(toggleColorsButton.value)
  });

  // Copy Button
  const copyBtn = Array.prototype.slice.call(
    document.querySelectorAll(".copyButton")
  );
  const copiedText = Array.prototype.slice.call(
    document.querySelectorAll(".copiedText")
  );
  const copyMsg = Array.prototype.slice.call(
    document.querySelectorAll(".copyMessage")
  );
  copyBtn.forEach((copyBtn, i) => {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(copiedText[i].innerText);
      copyMsg[i].style.opacity = 1;
      setTimeout(() => {
        copyMsg[i].style.opacity = 0;
      }, 2000);
    });
  });

  Prism.highlightAll();

  // Materialize Components

  M.Carousel.init(document.querySelectorAll(".carousel"), {});
  M.Carousel.init(document.querySelectorAll(".carousel.carousel-slider"), {
    fullWidth: true,
    indicators: true,
    onCycleTo: () => {},
  });

  M.Collapsible.init(document.querySelectorAll(".collapsible"), {});
  M.Collapsible.init(document.querySelectorAll(".collapsible.expandable"), {
    accordion: false,
  });

  M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"), {});
  M.Dropdown.init(document.querySelector("#dropdown-demo-left"), {
    alignment: "left",
    constrainWidth: false,
  });
  M.Dropdown.init(document.querySelector("#dropdown-demo-right"), {
    alignment: "right",
    constrainWidth: false,
  });

  M.Parallax.init(document.querySelectorAll(".parallax"), {});

  // Media
  M.Materialbox.init(document.querySelectorAll(".materialboxed"), {});
  M.Slider.init(document.querySelectorAll(".slider"), {});

  M.Modal.init(document.querySelectorAll(".modal"), {});

  M.ScrollSpy.init(document.querySelectorAll(".scrollspy"), {});

  M.Datepicker.init(document.querySelectorAll(".datepicker"), {});

  M.Tabs.init(document.querySelectorAll(".tabs"), {});
  M.Tabs.init(document.querySelectorAll("#tabs-swipe-demo"), {
    swipeable: true,
  });

  M.Timepicker.init(document.querySelectorAll(".timepicker"), {});

  M.Tooltip.init(document.querySelectorAll(".tooltipped"), {});

  M.Sidenav.init(document.querySelectorAll(".sidenav"), {});

  const tts = M.TapTarget.init(document.querySelectorAll(".tap-target"), {});
  document
    .querySelector("#open-taptarget")
    ?.addEventListener("click", () => tts[0].open());
  document
    .querySelector("#close-taptarget")
    ?.addEventListener("click", () => tts[0].close());

  M.FormSelect.init(document.querySelectorAll("select:not(.disabled)"), {});

  M.CharacterCounter.init(document.querySelectorAll("[maxlength]"), {});

  // https://gist.githubusercontent.com/pratikbutani/20ded7151103bb30737e2ab1b336eb02/raw/be1391e25487ded4179b5f1c8eedb81b01226216/country-flag.json
  const autocompleteDemoData = [
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1e8.svg",
      text: "Ascension Island",
      id: "ac",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1e9.svg",
      text: "Andorra",
      id: "ad",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1ea.svg",
      text: "United Arab Emirates",
      id: "ae",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1eb.svg",
      text: "Afghanistan",
      id: "af",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1ec.svg",
      text: "Antigua & Barbuda",
      id: "ag",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1ee.svg",
      text: "Anguilla",
      id: "ai",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f1.svg",
      text: "Albania",
      id: "al",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f2.svg",
      text: "Armenia",
      id: "am",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f4.svg",
      text: "Angola",
      id: "ad",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f6.svg",
      text: "Antarctica",
      id: "aq",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f7.svg",
      text: "Argentina",
      id: "ar",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f8.svg",
      text: "American Samoa",
      id: "as",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f9.svg",
      text: "Austria",
      id: "at",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1fa.svg",
      text: "Australia",
      id: "au",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1fc.svg",
      text: "Aruba",
      id: "aw",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1fd.svg",
      text: "Åland Islands",
      id: "ax",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1ff.svg",
      text: "Azerbaijan",
      id: "az",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e6.svg",
      text: "Bosnia & Herzegovina",
      id: "ba",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e7.svg",
      text: "Barbados",
      id: "bb",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e9.svg",
      text: "Bangladesh",
      id: "bd",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ea.svg",
      text: "Belgium",
      id: "be",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1eb.svg",
      text: "Burkina Faso",
      id: "bf",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ec.svg",
      text: "Bulgaria",
      id: "bg",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ed.svg",
      text: "Bahrain",
      id: "bh",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ee.svg",
      text: "Burundi",
      id: "bi",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ef.svg",
      text: "Benin",
      id: "bj",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f1.svg",
      text: "St. Barthélemy",
      id: "bl",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f2.svg",
      text: "Bermuda",
      id: "bm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f3.svg",
      text: "Brunei",
      id: "bn",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f4.svg",
      text: "Bolivia",
      id: "bo",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f6.svg",
      text: "Caribbean Netherlands",
      id: "bq",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f7.svg",
      text: "Brazil",
      id: "br",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f8.svg",
      text: "Bahamas",
      id: "bs",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f9.svg",
      text: "Bhutan",
      id: "bt",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1fb.svg",
      text: "Bouvet Island",
      id: "bv",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1fc.svg",
      text: "Botswana",
      id: "bw",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1fe.svg",
      text: "Belarus",
      id: "by",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ff.svg",
      text: "Belize",
      id: "bz",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1e6.svg",
      text: "Canada",
      id: "ca",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1e8.svg",
      text: "Cocos (Keeling) Islands",
      id: "cc",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1e9.svg",
      text: "Congo - Kinshasa",
      id: "cg",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1eb.svg",
      text: "Central African Republic",
      id: "cf",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1ec.svg",
      text: "Congo - Brazzaville",
      id: "cd",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1ed.svg",
      text: "Switzerland",
      id: "ch",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1ee.svg",
      text: "Côte d’Ivoire",
      id: "ci",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f0.svg",
      text: "Cook Islands",
      id: "ck",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f1.svg",
      text: "Chile",
      id: "cl",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f2.svg",
      text: "Cameroon",
      id: "cm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f3.svg",
      text: "China",
      id: "cn",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f4.svg",
      text: "Colombia",
      id: "co",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f5.svg",
      text: "Clipperton Island",
      id: "cp",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f7.svg",
      text: "Costa Rica",
      id: "cr",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1fa.svg",
      text: "Cuba",
      id: "cu",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1fb.svg",
      text: "Cape Verde",
      id: "cv",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1fc.svg",
      text: "Curaçao",
      id: "cw",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1fd.svg",
      text: "Christmas Island",
      id: "cx",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1fe.svg",
      text: "Cyprus",
      id: "cy",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1ff.svg",
      text: "Czechia",
      id: "cz",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1ea.svg",
      text: "Germany",
      id: "de",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1ec.svg",
      text: "Diego Garcia",
      id: "dg",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1ef.svg",
      text: "Djibouti",
      id: "dj",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1f0.svg",
      text: "Denmark",
      id: "dk",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1f2.svg",
      text: "Dominica",
      id: "dm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1f4.svg",
      text: "Dominican Republic",
      id: "do",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1ff.svg",
      text: "Algeria",
      id: "dz",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1e6.svg",
      text: "Ceuta & Melilla",
      id: "ea",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1e8.svg",
      text: "Ecuador",
      id: "ec",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1ea.svg",
      text: "Estonia",
      id: "ee",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1ec.svg",
      text: "Egypt",
      id: "eg",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1ed.svg",
      text: "Western Sahara",
      id: "eh",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1f7.svg",
      text: "Eritrea",
      id: "er",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1f8.svg",
      text: "Spain",
      id: "es",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1f9.svg",
      text: "Ethiopia",
      id: "et",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1fa.svg",
      text: "European Union",
      id: "eu",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1ee.svg",
      text: "Finland",
      id: "fi",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1ef.svg",
      text: "Fiji",
      id: "fj",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1f0.svg",
      text: "Falkland Islands",
      id: "fk",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1f2.svg",
      text: "Micronesia",
      id: "fm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1f4.svg",
      text: "Faroe Islands",
      id: "fo",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1f7.svg",
      text: "France",
      id: "fr",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1e6.svg",
      text: "Gabon",
      id: "ga",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1e7.svg",
      text: "United Kingdom",
      id: "gb",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1e9.svg",
      text: "Grenada",
      id: "gd",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1ea.svg",
      text: "Georgia",
      id: "ge",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1eb.svg",
      text: "French Guiana",
      id: "gf",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1ec.svg",
      text: "Guernsey",
      id: "gg",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1ed.svg",
      text: "Ghana",
      id: "gh",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1ee.svg",
      text: "Gibraltar",
      id: "gi",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f1.svg",
      text: "Greenland",
      id: "gl",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f2.svg",
      text: "Gambia",
      id: "gm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f3.svg",
      text: "Guinea",
      id: "gn",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f5.svg",
      text: "Guadeloupe",
      id: "gp",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f6.svg",
      text: "Equatorial Guinea",
      id: "gq",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f7.svg",
      text: "Greece",
      id: "gr",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f8.svg",
      text: "South Georgia & South', Sandwich Islands",
      id: "gs",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f9.svg",
      text: "Guatemala",
      id: "gt",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1fa.svg",
      text: "Guam",
      id: "gu",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1fc.svg",
      text: "Guinea-Bissau",
      id: "gw",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1fe.svg",
      text: "Guyana",
      id: "gy",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1f0.svg",
      text: "Hong Kong SAR China",
      id: "hk",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1f2.svg",
      text: "Heard & McDonald Islands",
      id: "hm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1f3.svg",
      text: "Honduras",
      id: "hn",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1f7.svg",
      text: "Croatia",
      id: "hr",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1f9.svg",
      text: "Haiti",
      id: "ht",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1fa.svg",
      text: "Hungary",
      id: "hu",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1e8.svg",
      text: "Canary Islands",
      id: "ic",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1e9.svg",
      text: "Indonesia",
      id: "id",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1ea.svg",
      text: "Ireland",
      id: "ie",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f1.svg",
      text: "Israel",
      id: "il",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f2.svg",
      text: "Isle of Man",
      id: "im",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f3.svg",
      text: "India",
      id: "in",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f4.svg",
      text: "British Indian Ocean Territory",
      id: "io",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f6.svg",
      text: "Iraq",
      id: "iq",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f7.svg",
      text: "Iran",
      id: "ir",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f8.svg",
      text: "Iceland",
      id: "is",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f9.svg",
      text: "Italy",
      id: "it",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ef-1f1ea.svg",
      text: "Jersey",
      id: "je",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ef-1f1f2.svg",
      text: "Jamaica",
      id: "jm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ef-1f1f4.svg",
      text: "Jordan",
      id: "jo",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ef-1f1f5.svg",
      text: "Japan",
      id: "jp",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1ea.svg",
      text: "Kenya",
      id: "ke",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1ec.svg",
      text: "Kyrgyzstan",
      id: "kg",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1ed.svg",
      text: "Cambodia",
      id: "kh",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1ee.svg",
      text: "Kiribati",
      id: "ki",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1f2.svg",
      text: "Comoros",
      id: "km",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1f3.svg",
      text: "St. Kitts & Nevis",
      id: "kn",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1f5.svg",
      text: "North Korea",
      id: "kp",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1f7.svg",
      text: "South Korea",
      id: "kr",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1fc.svg",
      text: "Kuwait",
      id: "kw",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1fe.svg",
      text: "Cayman Islands",
      id: "ky",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1ff.svg",
      text: "Kazakhstan",
      id: "kz",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1e6.svg",
      text: "Laos",
      id: "la",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1e7.svg",
      text: "Lebanon",
      id: "lb",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1e8.svg",
      text: "St. Lucia",
      id: "lc",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1ee.svg",
      text: "Liechtenstein",
      id: "li",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1f0.svg",
      text: "Sri Lanka",
      id: "lk",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1f7.svg",
      text: "Liberia",
      id: "lr",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1f8.svg",
      text: "Lesotho",
      id: "ls",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1f9.svg",
      text: "Lithuania",
      id: "lt",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1fa.svg",
      text: "Luxembourg",
      id: "lu",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1fb.svg",
      text: "Latvia",
      id: "lv",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1fe.svg",
      text: "Libya",
      id: "ly",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1e6.svg",
      text: "Morocco",
      id: "ma",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1e8.svg",
      text: "Monaco",
      id: "mc",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1e9.svg",
      text: "Moldova",
      id: "md",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1ea.svg",
      text: "Montenegro",
      id: "me",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1eb.svg",
      text: "St. Martin",
      id: "mf",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1ec.svg",
      text: "Madagascar",
      id: "mg",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1ed.svg",
      text: "Marshall Islands",
      id: "mh",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f0.svg",
      text: "North Macedonia",
      id: "mk",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f1.svg",
      text: "Mali",
      id: "ml",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f2.svg",
      text: "Myanmar (Burma)",
      id: "mm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f3.svg",
      text: "Mongolia",
      id: "mn",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f4.svg",
      text: "Macao Sar China",
      id: "mo",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f5.svg",
      text: "Northern Mariana Islands",
      id: "mp",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f6.svg",
      text: "Martinique",
      id: "mq",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f7.svg",
      text: "Mauritania",
      id: "mr",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f8.svg",
      text: "Montserrat",
      id: "ms",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f9.svg",
      text: "Malta",
      id: "mt",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1fa.svg",
      text: "Mauritius",
      id: "mu",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1fb.svg",
      text: "Maldives",
      id: "mv",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1fc.svg",
      text: "Malawi",
      id: "mw",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1fd.svg",
      text: "Mexico",
      id: "mx",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1fe.svg",
      text: "Malaysia",
      id: "my",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1ff.svg",
      text: "Mozambique",
      id: "mz",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1e6.svg",
      text: "Namibia",
      id: "na",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1e8.svg",
      text: "New Caledonia",
      id: "nc",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1ea.svg",
      text: "Niger",
      id: "ne",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1eb.svg",
      text: "Norfolk Island",
      id: "nf",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1ec.svg",
      text: "Nigeria",
      id: "ng",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1ee.svg",
      text: "Nicaragua",
      id: "ni",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1f1.svg",
      text: "Netherlands",
      id: "nl",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1f4.svg",
      text: "Norway",
      id: "no",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1f5.svg",
      text: "Nepal",
      id: "np",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1f7.svg",
      text: "Nauru",
      id: "nr",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1fa.svg",
      text: "Niue",
      id: "nu",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1ff.svg",
      text: "New Zealand",
      id: "nz",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f4-1f1f2.svg",
      text: "Oman",
      id: "om",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1e6.svg",
      text: "Panama",
      id: "pa",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1ea.svg",
      text: "Peru",
      id: "pe",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1eb.svg",
      text: "French Polynesia",
      id: "pf",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1ec.svg",
      text: "Papua New Guinea",
      id: "pg",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1ed.svg",
      text: "Philippines",
      id: "ph",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f0.svg",
      text: "Pakistan",
      id: "pk",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f1.svg",
      text: "Poland",
      id: "pl",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f2.svg",
      text: "St. Pierre & Miquelon",
      id: "pm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f3.svg",
      text: "Pitcairn Islands",
      id: "pn",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f7.svg",
      text: "Puerto Rico",
      id: "pr",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f8.svg",
      text: "Palestinian Territories",
      id: "ps",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f9.svg",
      text: "Portugal",
      id: "pt",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1fc.svg",
      text: "Palau",
      id: "pw",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1fe.svg",
      text: "Paraguay",
      id: "py",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f6-1f1e6.svg",
      text: "Qatar",
      id: "qa",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f7-1f1ea.svg",
      text: "Réunion",
      id: "re",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f7-1f1f4.svg",
      text: "Romania",
      id: "ro",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f7-1f1f8.svg",
      text: "Serbia",
      id: "yu",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f7-1f1fa.svg",
      text: "Russia",
      id: "ru",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f7-1f1fc.svg",
      text: "Rwanda",
      id: "rw",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1e6.svg",
      text: "Saudi Arabia",
      id: "sa",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1e7.svg",
      text: "Solomon Islands",
      id: "sb",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1e8.svg",
      text: "Seychelles",
      id: "sc",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1e9.svg",
      text: "Sudan",
      id: "sd",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ea.svg",
      text: "Sweden",
      id: "se",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ec.svg",
      text: "Singapore",
      id: "sg",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ed.svg",
      text: "St. Helena",
      id: "sh",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ee.svg",
      text: "Slovenia",
      id: "si",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ef.svg",
      text: "Svalbard & Jan Mayen",
      id: "sj",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f0.svg",
      text: "Slovakia",
      id: "sk",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f1.svg",
      text: "Sierra Leone",
      id: "sl",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f2.svg",
      text: "San Marino",
      id: "sm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f3.svg",
      text: "Senegal",
      id: "sn",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f4.svg",
      text: "Somalia",
      id: "so",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f7.svg",
      text: "Suriname",
      id: "sr",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f8.svg",
      text: "South Sudan",
      id: "ss",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f9.svg",
      text: "São Tomé & Príncipe",
      id: "st",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1fb.svg",
      text: "El Salvador",
      id: "sv",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1fd.svg",
      text: "Sint Maarten",
      id: "sx",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1fe.svg",
      text: "Syria",
      id: "sy",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ff.svg",
      text: "Eswatini",
      id: "sz",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1e6.svg",
      text: "Tristan Da Cunha",
      id: "sh",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1e8.svg",
      text: "Turks & Caicos Islands",
      id: "tc",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1e9.svg",
      text: "Chad",
      id: "td",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1eb.svg",
      text: "French Southern Territories",
      id: "tf",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1ec.svg",
      text: "Togo",
      id: "tg",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1ed.svg",
      text: "Thailand",
      id: "th",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1ef.svg",
      text: "Tajikistan",
      id: "tj",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f0.svg",
      text: "Tokelau",
      id: "tk",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f1.svg",
      text: "Timor-Leste",
      id: "tl",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f2.svg",
      text: "Turkmenistan",
      id: "tm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f3.svg",
      text: "Tunisia",
      id: "tn",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f4.svg",
      text: "Tonga",
      id: "to",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f7.svg",
      text: "Turkey",
      id: "tr",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f9.svg",
      text: "Trinidad & Tobago",
      id: "tt",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1fb.svg",
      text: "Tuvalu",
      id: "tv",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1fc.svg",
      text: "Taiwan",
      id: "tw",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1ff.svg",
      text: "Tanzania",
      id: "tz",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1e6.svg",
      text: "Ukraine",
      id: "ua",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1ec.svg",
      text: "Uganda",
      id: "ug",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1f2.svg",
      text: "U.S. Outlying Islands",
      id: "um",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1f3.svg",
      text: "United Nations",
      id: "un",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1f8.svg",
      text: "United States",
      id: "us",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1fe.svg",
      text: "Uruguay",
      id: "uy",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1ff.svg",
      text: "Uzbekistan",
      id: "uz",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1e6.svg",
      text: "Vatican City",
      id: "va",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1e8.svg",
      text: "St. Vincent & Grenadines",
      id: "vc",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1ea.svg",
      text: "Venezuela",
      id: "ve",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1ec.svg",
      text: "British Virgin Islands",
      id: "vg",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1ee.svg",
      text: "U.S. Virgin Islands",
      id: "vi",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1f3.svg",
      text: "Vietnam",
      id: "vn",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1fa.svg",
      text: "Vanuatu",
      id: "vu",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fc-1f1eb.svg",
      text: "Wallis & Futuna",
      id: "wf",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fc-1f1f8.svg",
      text: "Samoa",
      id: "ws",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fd-1f1f0.svg",
      text: "Kosovo",
      id: "xk",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fe-1f1ea.svg",
      text: "Yemen",
      id: "ye",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1fe-1f1f9.svg",
      text: "Mayotte",
      id: "yt",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ff-1f1e6.svg",
      text: "South Africa",
      id: "za",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ff-1f1f2.svg",
      text: "Zambia",
      id: "zm",
    },
    {
      image: "https://twemoji.maxcdn.com/2/svg/1f1ff-1f1fc.svg",
      text: "Zimbabwe",
      id: "zw",
    },
    {
      flag:
        "https://twemoji.maxcdn.com/2/svg/1f3f4-e0067-e0062-e0065-e006e-e0067-e007f.svg",
      text: "England",
      id: "uk",
    },
    {
      flag:
        "https://twemoji.maxcdn.com/2/svg/1f3f4-e0067-e0062-e0073-e0063-e0074-e007f.svg",
      text: "Scotland",
      id: "uk",
    },
    {
      flag:
        "https://twemoji.maxcdn.com/2/svg/1f3f4-e0067-e0062-e0077-e006c-e0073-e007f.svg",
      text: "Wales",
      id: "uk",
    },
  ];

  M.Autocomplete.init(document.querySelectorAll("input.autocomplete"), {
    minLength: 0,
    data: autocompleteDemoData,
  });
  M.Autocomplete.init(
    document.querySelectorAll("input.autocomplete-multiple"),
    {
      isMultiSelect: true,
      minLength: 1,
      data: autocompleteDemoData,
    }
  );

  M.Chips.init(document.querySelectorAll(".chips"), {});
  M.Chips.init(document.querySelectorAll(".chips-initial"), {
    readOnly: true,
    data: autocompleteDemoData.filter((country) =>
      ["ma", "ta", "er", "ia", "li", "ze"].includes(country.id)
    ),
  });
  M.Chips.init(document.querySelectorAll(".chips-placeholder"), {
    placeholder: "Enter a tag",
    secondaryPlaceholder: "+Tag",
  });
  M.Chips.init(document.querySelectorAll(".chips-autocomplete"), {
    autocompleteOptions: {
      data: autocompleteDemoData,
    },
  });

  M.FloatingActionButton.init(
    document.querySelectorAll(".fixed-action-btn"),
    {}
  );
  M.FloatingActionButton.init(
    document.querySelectorAll(".fixed-action-btn.horizontal"),
    {
      direction: "left",
    }
  );
  M.FloatingActionButton.init(
    document.querySelectorAll(".fixed-action-btn.click-to-toggle"),
    {
      direction: "left",
      hoverEnabled: false,
    }
  );
  M.FloatingActionButton.init(
    document.querySelectorAll(".fixed-action-btn.toolbar"),
    {
      toolbarEnabled: true,
    }
  );
});
