import { applyTheme, argbFromHex, themeFromSourceColor } from "@material/material-color-utilities";
import { CssGenerator } from "./css-generator";

export class Themes {
  static themePrimaryColorStorageKey: string = "theme-primary-color";
  static themeModeStorageKey: string = "theme-mode";

  constructor(private document: Document) {}

  setThemePrimaryColor(value: string) {
    localStorage.setItem(Themes.themePrimaryColorStorageKey, value);
    this.applyThemeProperties(this.isDarkMode());
  }

  getThemePrimaryColor(): string {
    let themeColor = localStorage.getItem(Themes.themePrimaryColorStorageKey);
    if (!themeColor) themeColor = "#006495";
    return themeColor;
  }

  isDarkMode(): boolean {
    // Manually stored
    const stored = localStorage.getItem(Themes.themeModeStorageKey);
    if (stored === "dark") return true;
    if (stored === "light") return false;
    // Via CSS or System
    const isDarkModeByCss = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return isDarkModeByCss;
  }

  setLightMode() {
    this.document.documentElement.setAttribute("theme", "light");
    localStorage.setItem(Themes.themeModeStorageKey, "light");
    this.applyThemeProperties(false);
  }

  setDarkMode() {
    this.document.documentElement.setAttribute("theme", "dark");
    localStorage.setItem(Themes.themeModeStorageKey, "dark");
    this.applyThemeProperties(true);
  }

  public applyThemeProperties(isDark: boolean) {
    let themeColor = this.getThemePrimaryColor();
    const color = argbFromHex(themeColor);
    const atheme = themeFromSourceColor(color);
    const target = this.document.body;
    this.document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    applyTheme(atheme, { target: target, dark: isDark, brightnessSuffix: true });
  }

  downloadCss() {
    const color = argbFromHex(this.getThemePrimaryColor());
    const generator = new CssGenerator(themeFromSourceColor(color));
    const fileLines = generator.tokens();
    this.downloadFile("tokens.module.scss", fileLines.join("\n"));
  }

  downloadFile(filename, text) {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  setThemeProperty(target: HTMLElement, targetProp: string, sourceProp: string) {
    const color = target.style.getPropertyValue(sourceProp);
    target.style.setProperty(targetProp, color);
  }
}
