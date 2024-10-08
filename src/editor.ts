/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { GoogleFontsCardConfig } from './types';
import { customElement, property, state } from 'lit/decorators';
import { formfieldDefinition } from '../elements/formfield';
import { selectDefinition } from '../elements/select';
import { switchDefinition } from '../elements/switch';
import { textfieldDefinition } from '../elements/textfield';

@customElement('google-fonts-header-card-editor')
export class GoogleFontsCardEditor extends ScopedRegistryHost(LitElement) implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: GoogleFontsCardConfig;

  @state() private _helpers?: any;

  private _initialized = false;

  static elementDefinitions = {
    ...textfieldDefinition,
    ...selectDefinition,
    ...switchDefinition,
    ...formfieldDefinition,
  };

  public setConfig(config: GoogleFontsCardConfig): void {
    this._config = config;

    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _heading(): string {
    return this._config?.heading || '';
  }

  get _font(): string {
    return this._config?.font || '';
  }

  get _font_size(): string {
    return this._config?.font_size || '';
  }

  get _font_weight(): string {
    return this._config?.font_weight || '';
  }

  get _show_blob(): boolean {
    return this._config?.show_blob || false;
  }

  get _color_gradient_top(): string {
    return this._config?.color_gradient_top || 'var(--primary-color)';
  }

  get _color_gradient_bottom(): string {
    return this._config?.color_gradient_bottom || 'var(--accent-color)';
  }

  get _blob_animation_speed(): string {
    return this._config?.blob_animation_speed || '0.01';
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    // You can restrict on domain type
    // const entities = Object.keys(this.hass.states);

    return html`
      <mwc-textfield
        label="Heading (Required)"
        .value=${this._heading}
        .configValue=${'heading'}
        @input=${this._valueChanged}
      ></mwc-textfield>
      <mwc-textfield
        label="Google Font Name (Required)"
        .value=${this._font}
        .configValue=${'font'}
        @input=${this._valueChanged}
      ></mwc-textfield>
      <mwc-textfield
        label="Font Size (default 1em)"
        .value=${this._font_size}
        .configValue=${'font_size'}
        @input=${this._valueChanged}
      ></mwc-textfield>
      <mwc-textfield
        label="Font Weight (default 900)"
        .value=${this._font_weight}
        .configValue=${'font_weight'}
        @input=${this._valueChanged}
      ></mwc-textfield>
      <mwc-formfield .label=${`Toggle blob ${this._show_blob ? 'off' : 'on'}`}>
        <mwc-switch
          .checked=${this._show_blob !== false}
          .configValue=${'show_blob'}
          @change=${this._valueChanged}
        ></mwc-switch>
      </mwc-formfield>
      ${this._show_blob ? html`
          <mwc-textfield
            label="Blob Color Gradient (Top)"
            .value=${this._color_gradient_top}
            .configValue=${'color_gradient_top'}
            @input=${this._valueChanged}
          ></mwc-textfield>
          <mwc-textfield
            label="Blob Color Gradient (Bottom)"
            .value=${this._color_gradient_bottom}
            .configValue=${'color_gradient_bottom'}
            @input=${this._valueChanged}
          ></mwc-textfield>
          <mwc-textfield
            label="Blob Animation Speed"
            .value=${this._blob_animation_speed}
            .configValue=${'blob_animation_speed'}
            @input=${this._valueChanged}
          ></mwc-textfield>
        ` : null}
    `;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static styles: CSSResultGroup = css`
    mwc-select,
    mwc-textfield {
      margin-bottom: 16px;
      display: block;
    }
    mwc-formfield {
      padding-bottom: 8px;
    }
    mwc-switch {
      --mdc-theme-secondary: var(--switch-checked-color);
    }
  `;
}
