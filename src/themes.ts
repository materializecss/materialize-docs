import { argbFromHex, themeFromSourceColor } from "@material/material-color-utilities";
import { CssGenerator } from "./css-generator";

function setThemeProperty(target: HTMLElement, targetProp:string, sourceProp: string)
{
  const color = target.style.getPropertyValue(sourceProp);
  target.style.setProperty(targetProp, color);
}

export function setThemeProperties(target: HTMLElement)
  {
    setThemeProperty(target, '--surface-color', '--md-sys-color-surface')
    setThemeProperty(target, '--background-color', '--md-sys-color-background')
    setThemeProperty(target, '--font-color-main', '--md-sys-color-on-background')
    setThemeProperty(target, '--font-color-medium', '--md-sys-color-on-surface-variant')
    setThemeProperty(target, '--font-color-disabled', '--md-sys-color-on-surface')
    setThemeProperty(target, '--font-on-primary-color-main', '--md-sys-color-on-primary')
    setThemeProperty(target, '--font-on-primary-color-dark-main', '--md-sys-color-on-primary-dark')
    setThemeProperty(target, '--font-on-primary-color-dark-medium', '--md-sys-color-on-surface-variant-dark')
    setThemeProperty(target, '--font-on-primary-color-medium', '--md-sys-color-on-surface-variant')
    //setThemeProperty(target, '---font-on-primary-color-disabled', '--')
    setThemeProperty(target, '--font-on-secondary-color-main', '--md-sys-color-on-secondary')
    
    
    
 
    // --hover-color: rgba(0, 0, 0, 0.04);
    // --focus-color: rgba(0, 0, 0, 0.12);
    // --focus-color-solid: #E0E0E0;
  
    // --background-color-disabled: rgba(0, 0, 0, 0.12);
    // --background-color-level-4dp: rgba(0, 0, 0, 0.09);
    setThemeProperty(target, '--background-color-level-16dp-solid', '--surface-color')
    
    // --background-color-slight-emphasis: rgba(0, 0, 0, 0.08);
    
    setThemeProperty(target, '--background-color-card', '--surface-color')
  
    // --tooltip-background-color: #313033;
    // --tooltip-font-color: rgba(255, 255, 255, 0.77);
  
    // --separator-color: #DDDDDD; /* borders between components */
  
    // --error-color: #F44336;
  
        
    setThemeProperty(target, '--slider-track-color', '--md-sys-color-shadow-light')
    setThemeProperty(target, '--switch-thumb-off-color', '--md-ref-palette-primary100')
  
    // --carousel-indicator-color: rgba(255, 255, 255, 0.45);
    
    setThemeProperty(target, '--carousel-indicator-active-color', '--md-ref-palette-primary100')    
    setThemeProperty(target, '--primary-color', '--md-sys-color-primary')
        
  
    setThemeProperty(target, '--primary-color-dark', '--md-sys-color-primary-dark')
    setThemeProperty(target, '--primary-color-raised-hover-solid', '--md-ref-palette-primary80')
    // --primary-color-font-medium-color: rgba(var(--primary-color-numeric), 0.7);
    // --primary-color-font-disabled-color: rgba(var(--primary-color-numeric), 0.4);
    // --primary-color-hover-opaque: rgba(var(--primary-color-numeric), 0.06);
    // --primary-color-focus-opaque: rgba(var(--primary-color-numeric), 0.18);
    
    setThemeProperty(target, '--secondary-color', '--md-sys-color-secondary')
    setThemeProperty(target, '--secondary-color-hover-solid', '--md-ref-palette-secondary70')
    setThemeProperty(target, '--secondary-color-focus-solid', '--md-ref-palette-secondary80')
    setThemeProperty(target, '--secondary-container-color', '--md-sys-color-secondary-container')
    setThemeProperty(target, '--font-on-secondary-container-color', '--md-sys-color-on-secondary-container')

  
    // --md_sys_color_on-surface: 28, 27, 31;
  }

  
export function downloadCss()
{
  let themeColor = localStorage.getItem('theme-color');
  if (!themeColor)
    themeColor = "#006495"
  const color = argbFromHex(themeColor)
    
  const generator = new CssGenerator(themeFromSourceColor(color))
  var fileLines = generator.tokens();  
  downloadFile('tokens.module.scss', fileLines.join('\n'));

}


function downloadFile(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

