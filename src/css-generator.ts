import { Scheme, Theme, hexFromArgb } from "@material/material-color-utilities";

export class CssGenerator {
  constructor(private readonly theme: Theme) {}

  tokens(): string[] {
    const rgbHex = hexFromArgb(this.theme.palettes.primary.tone(40))  
    const tones = [0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100]  
    return [
      ':root {', 
      `  --md-source: ${rgbHex};`,
      '  /* primary */',
      ...tones.map(tone => this.getPaletteNum("  --md-ref-palette-primary", tone, (n) => this.theme.palettes.primary.tone(n))),      
      '  /* secondary */',
      ...tones.map(tone => this.getPaletteNum("  --md-ref-palette-secondary", tone, (n) => this.theme.palettes.secondary.tone(n))),        
      '  /* tertiary */',
      ...tones.map(tone => this.getPaletteNum("  --md-ref-palette-tertiary", tone, (n) => this.theme.palettes.tertiary.tone(n))),        
      '  /* neutral */',
      ...tones.map(tone => this.getPaletteNum("  --md-ref-palette-neutral", tone, (n) => this.theme.palettes.neutral.tone(n))),        
      '  /* neutral-variant */',
      ...tones.map(tone => this.getPaletteNum("  --md-ref-palette-neutral-variant", tone, (n) => this.theme.palettes.neutralVariant.tone(n))),        
      '  /* error */',
      ...tones.map(tone => this.getPaletteNum("  --md-ref-palette-error", tone, (n) => this.theme.palettes.error.tone(n))),
      ...this.cssModeColors('light', this.theme.schemes.light),
      ...this.cssModeColors('dark', this.theme.schemes.dark),
      ...this.fontStyles('display-large',  'Regular', '400px', '57px', '64px', '-0.25px'),
      ...this.fontStyles('display-medium', 'Regular', '400px', '45px', '52px', '0px'),
      ...this.fontStyles('display-small', 'Regular','400px', '36px', '44px', '0px'),
      ...this.fontStyles('headline-large', 'Regular','400px', '32px', '40px', '0px'),
      ...this.fontStyles('headline-medium', 'Regular','400px', '28px', '36px', '0px'),
      ...this.fontStyles('headline-small', 'Regular','400px', '24px', '32px', '0px'),
      ...this.fontStyles('body-large', 'Regular','400px', '16px', '24px', '0.50px'),
      ...this.fontStyles('body-medium', 'Regular','400px', '14px', '20px', '0.25px'),
      ...this.fontStyles('body-small', 'Regular','400px', '12px', '16px', '0.40px'),
      ...this.fontStyles('label-large', 'Medium','500px', '14px', '20px', '0.10px'),
      ...this.fontStyles('label-medium', 'Medium','500px', '12px', '16px', '0.50px'),
      ...this.fontStyles('label-small', 'Medium','500px', '11px', '16px', '0.50px'),
      ...this.fontStyles('title-large', 'Regular','400px', '22px', '28px', '0px'),
      ...this.fontStyles('title-medium', 'Medium','500px', '16px', '24px', '0.15px'),
      ...this.fontStyles('title-small', 'Medium','500px', '14px', '20px', '0.10px'),
      "}"        
    ]
  
    
  }
  
  cssModeColors(mode: string, scheme: Scheme): string[] {
    return [
      `  /* ${mode} */`,
      this.getRoleColor(mode, "--md-sys-color-primary", scheme.primary),
      this.getRoleColor(mode, "--md-sys-color-on-primary", scheme.onPrimary),
      this.getRoleColor(mode, "--md-sys-color-primary-container", scheme.primaryContainer),    
      this.getRoleColor(mode, "--md-sys-color-on-primary-container", scheme.onPrimaryContainer),    
      this.getRoleColor(mode, "--md-sys-color-secondary", scheme.secondary),
      this.getRoleColor(mode, "--md-sys-color-on-secondary", scheme.onSecondary),
      this.getRoleColor(mode, "--md-sys-color-secondary-container", scheme.secondaryContainer),
      this.getRoleColor(mode, "--md-sys-color-on-secondary-container", scheme.onSecondaryContainer),
      this.getRoleColor(mode, "--md-sys-color-tertiary", scheme.tertiary),
      this.getRoleColor(mode, "--md-sys-color-on-tertiary", scheme.onTertiary),
      this.getRoleColor(mode, "--md-sys-color-tertiary-container", scheme.tertiaryContainer),
      this.getRoleColor(mode, "--md-sys-color-on-tertiary-container", scheme.onTertiaryContainer),
      this.getRoleColor(mode, "--md-sys-color-error", scheme.error),
      this.getRoleColor(mode, "--md-sys-color-error-container", scheme.errorContainer),
      this.getRoleColor(mode, "--md-sys-color-on-error", scheme.onError),
      this.getRoleColor(mode, "--md-sys-color-on-error-container", scheme.onErrorContainer),    
      this.getRoleColor(mode, "--md-sys-color-background", scheme.background),
      this.getRoleColor(mode, "--md-sys-color-on-background", scheme.onBackground),
      this.getRoleColor(mode, "--md-sys-color-surface", scheme.surface),
      this.getRoleColor(mode, "--md-sys-color-on-surface", scheme.onSurface),
      this.getRoleColor(mode, "--md-sys-color-surface-variant", scheme.surfaceVariant),
      this.getRoleColor(mode, "--md-sys-color-on-surface-variant", scheme.onSurfaceVariant),
      this.getRoleColor(mode, "--md-sys-color-outline", scheme.outline),
      this.getRoleColor(mode, "--md-sys-color-inverse-on-surface", scheme.inverseOnSurface),
      this.getRoleColor(mode, "--md-sys-color-inverse-surface", scheme.inverseSurface),
      this.getRoleColor(mode, "--md-sys-color-inverse-primary", scheme.inversePrimary),
      this.getRoleColor(mode, "--md-sys-color-shadow", scheme.shadow),
      this.getRoleColor(mode, "--md-sys-color-surface-tint", scheme.surface),
      this.getRoleColor(mode, "--md-sys-color-outline-variant", scheme.outlineVariant),
      this.getRoleColor(mode, "--md-sys-color-scrim", scheme.scrim),
    ]
  }
  
  getPaletteNum(prefix: string, num: number, toTone: (num) => number): string
  {
    const rgbHex =  hexFromArgb(toTone(num))  
    return `${prefix}${num}: ${rgbHex};`
  }
  
  getRoleColor(mode: string, description: string, tone: number): string
  {
    const rgbHex =  hexFromArgb(tone)  
    return `  ${description}-${mode}: ${rgbHex};`
  }
  
      
  fontStyles(description: string, style: string, weight: string, size: string, lineHeight: string, letterSpacing: string): string[]
  {
    return  [`/* ${description} */`,
    `  --md-sys-typescale-${description}-font-family-name: Roboto;`,
    `  --md-sys-typescale-${description}-font-family-style: ${style};`,
    `  --md-sys-typescale-${description}-font-weight: ${weight};`,
    `  --md-sys-typescale-${description}-font-size: ${size};`,
    `  --md-sys-typescale-${description}-line-height: ${lineHeight};`,
    `  --md-sys-typescale-${description}-letter-spacing: ${letterSpacing};`] 
  }
      
      
     
}