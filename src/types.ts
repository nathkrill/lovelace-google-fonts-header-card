import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'google-fonts-header-card-editor': LovelaceCardEditor;
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
  font_size?: string;
  font_weight?: string;
  show_blob?: boolean;
  color_gradient_top?: string;
  color_gradient_bottom?: string;
  blob_animation_speed?: string;
}
