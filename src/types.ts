import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'google-fonts-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
  interface Point {
    'x': number,
    'y': number,
    'originX': number,
    'originY': number,
    'noiseOffsetX': number,
    'noiseOffsetY': number
  }
}

// TODO Add your configuration elements here for type-checking
export interface GoogleFontsCardConfig extends LovelaceCardConfig {
  type: string;
  heading?: string;
  font?: string;
  show_blob?: boolean;
  color_gradient_top?: string;
  color_gradient_bottom?: string;
  show_warning?: boolean;
  show_error?: boolean;
  test_gui?: boolean;
}
