import { applyTheme, argbFromHex, themeFromSourceColor } from "@material/material-color-utilities";
import { CssGenerator } from "./css-generator";

export class Themes {
  static themePrimaryColorStorageKey: string = 'theme-primary-color';
  static themeModeStorageKey: string = 'theme-mode';

  constructor(private document: Document)
  {

  } 
  
  setThemePrimaryColor(value: string) {    
    localStorage.setItem(Themes.themePrimaryColorStorageKey, value);
    this.applyThemeProperties();
  }

  getThemePrimaryColor(): string {
    let themeColor = localStorage.getItem(Themes.themePrimaryColorStorageKey);
    if (!themeColor)
      themeColor = "#006495"
    return themeColor;
  }

  setLightMode() {
    this.document.documentElement.setAttribute("theme", "light");
    localStorage.setItem(Themes.themeModeStorageKey, "light");
    this.applyThemeProperties()    
  }
  setDarkMode() {
    this.document.documentElement.setAttribute("theme", "dark");
    localStorage.setItem("theme-mode", "dark");
    this.applyThemeProperties()    
  }

  public applyThemeProperties() {
    const mode = localStorage.getItem(Themes.themeModeStorageKey);    
    const isDark = mode == "dark"

    let themeColor = this.getThemePrimaryColor();
    const color = argbFromHex(themeColor)
    
    const atheme = themeFromSourceColor(color)
    const target = this.document.body;
    applyTheme(atheme, {target: target, dark: isDark, brightnessSuffix: true})
    this.setThemeProperties(target)
  }

  downloadCss() {    
    const color = argbFromHex(this.getThemePrimaryColor())

    const generator = new CssGenerator(themeFromSourceColor(color))
    var fileLines = generator.tokens();
    this.downloadFile('tokens.module.scss', fileLines.join('\n'));

  }

  downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  public setThemeProperties(target: HTMLElement) {
    this.setThemeProperty(target, '--surface-color', '--md-sys-color-surface')
    this.setThemeProperty(target, '--background-color', '--md-sys-color-background')
    this.setThemeProperty(target, '--font-color-main', '--md-sys-color-on-background')
    this.setThemeProperty(target, '--font-color-medium', '--md-sys-color-on-surface-variant')
    this.setThemeProperty(target, '--font-color-disabled', '--md-sys-color-on-surface')
    this.setThemeProperty(target, '--font-on-primary-color-main', '--md-sys-color-on-primary')
    this.setThemeProperty(target, '--font-on-primary-color-dark-main', '--md-sys-color-on-primary-dark')
    this.setThemeProperty(target, '--font-on-primary-color-dark-medium', '--md-sys-color-on-surface-variant-dark')
    this.setThemeProperty(target, '--font-on-primary-color-medium', '--md-sys-color-on-surface-variant')
    //this.setThemeProperty(target, '---font-on-primary-color-disabled', '--')
    this.setThemeProperty(target, '--font-on-secondary-color-main', '--md-sys-color-on-secondary')




    // --hover-color: rgba(0, 0, 0, 0.04);
    // --focus-color: rgba(0, 0, 0, 0.12);
    // --focus-color-solid: #E0E0E0;

    // --background-color-disabled: rgba(0, 0, 0, 0.12);
    // --background-color-level-4dp: rgba(0, 0, 0, 0.09);
    this.setThemeProperty(target, '--background-color-level-16dp-solid', '--surface-color')

    // --background-color-slight-emphasis: rgba(0, 0, 0, 0.08);

    this.setThemeProperty(target, '--background-color-card', '--surface-color')

    // --tooltip-background-color: #313033;
    // --tooltip-font-color: rgba(255, 255, 255, 0.77);

    // --separator-color: #DDDDDD; /* borders between components */

    // --error-color: #F44336;


    this.setThemeProperty(target, '--slider-track-color', '--md-sys-color-shadow-light')
    this.setThemeProperty(target, '--switch-thumb-off-color', '--md-ref-palette-primary100')

    // --carousel-indicator-color: rgba(255, 255, 255, 0.45);

    this.setThemeProperty(target, '--carousel-indicator-active-color', '--md-ref-palette-primary100')
    this.setThemeProperty(target, '--primary-color', '--md-sys-color-primary')


    this.setThemeProperty(target, '--primary-color-dark', '--md-sys-color-primary-dark')
    this.setThemeProperty(target, '--primary-color-raised-hover-solid', '--md-ref-palette-primary80')
    // --primary-color-font-medium-color: rgba(var(--primary-color-numeric), 0.7);
    // --primary-color-font-disabled-color: rgba(var(--primary-color-numeric), 0.4);
    // --primary-color-hover-opaque: rgba(var(--primary-color-numeric), 0.06);
    // --primary-color-focus-opaque: rgba(var(--primary-color-numeric), 0.18);

    this.setThemeProperty(target, '--secondary-color', '--md-sys-color-secondary')
    this.setThemeProperty(target, '--secondary-color-hover-solid', '--md-ref-palette-secondary70')
    this.setThemeProperty(target, '--secondary-color-focus-solid', '--md-ref-palette-secondary80')
    this.setThemeProperty(target, '--secondary-container-color', '--md-sys-color-secondary-container')
    this.setThemeProperty(target, '--font-on-secondary-container-color', '--md-sys-color-on-secondary-container')


    // --md_sys_color_on-surface: 28, 27, 31;
  }


  setThemeProperty(target: HTMLElement, targetProp: string, sourceProp: string) {
    const color = target.style.getPropertyValue(sourceProp);
    target.style.setProperty(targetProp, color);
  }


}
