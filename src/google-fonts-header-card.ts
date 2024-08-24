/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers

import type { GoogleFontsCardConfig } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';
import { spline } from "@georgedoescode/spline";
import * as SimplexNoise from "simplex-noise";

/* eslint no-console: 0 */
console.info(
  `%c  GOOGLE FONTS CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'google-fonts-header-card',
  name: 'Google Fonts Header Card',
  description: 'A Lovelace card to display headers using Google Fonts in your Home Assistant Dashboards',
});

function loadCSS(url: string) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

// TODO Name your custom element
@customElement('google-fonts-header-card')
export class GoogleFontsCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement('google-fonts-header-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  // https://lit.dev/docs/components/properties/
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: GoogleFontsCardConfig;

  // https://lit.dev/docs/components/properties/#accessors-custom
  public setConfig(config: GoogleFontsCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config || !config.heading || !config.font) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: 'Boilerplate',
      ...config,
    };
  }

  // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  firstUpdated(changeProperties: PropertyValues) {
    super.firstUpdated(changeProperties)
    loadCSS(`https://fonts.googleapis.com/css2?family=${this.config.font?.replace(/ /g,"+")}&display=swap`);
    this.style.setProperty('font-family',`${this.config.font}, system-ui`)
    const path = this.renderRoot.querySelector(".blob path");
    if (!path) {
        return;
    }
        // used to set our custom property values
        // let noiseStep = 0.0005;
        const noiseStep = parseInt(this.config?.blob_animation_speed || '0.01');
        
        // const simplex = new SimplexNoise();
        
        const points = createPoints();
        
        (function animate() {
            if (!path) {
                return;
            }
        path.setAttribute("d", spline(points, 1, true));
        
        // for every point...
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
        
            // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
            const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
            const nY = noise(point.noiseOffsetY, point.noiseOffsetY);
            // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
            const x = map(nX, -1, 1, point.originX - 10, point.originX + 10);
            const y = map(nY, -1, 1, point.originY - 10, point.originY + 10);
        
            // update the point's current coordinates
            point.x = x;
            point.y = y;
        
            // progress the point's x, y values through "time"
            point.noiseOffsetX += noiseStep;
            point.noiseOffsetY += noiseStep;
        }
        
        //   root.style.setProperty("--startColor", `hsl(${hue}, 100%, 75%)`);
        //   root.style.setProperty("--stopColor", `hsl(${hue + 60}, 100%, 75%)`);
        
        
        requestAnimationFrame(animate);
        })();
        
        function map(n, start1, end1, start2, end2) {
        return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
        }
        
        function noise(x, y) {
          const noise2D = SimplexNoise.createNoise2D()
          return noise2D(x, y);
        }
        
        function createPoints(): Array<Point> {
          const points : Point[] = [];
          // how many points do we need
          const numPoints = 9;
          // used to equally space each point around the circle
          const angleStep = (Math.PI * 2) / numPoints;
          // the radius of the circle
          const rad = 75;
          
          for (let i = 1; i <= numPoints; i++) {
              // x & y coordinates of the current point
              const theta = i * angleStep;
          
              const x = 100 + Math.cos(theta) * rad;
              const y = 100 + Math.sin(theta) * rad;
          
              // store the point's position
              points.push({
                x: x,
                y: y,
                // we need to keep a reference to the point's original point for when we modulate the values later
                originX: x,
                originY: y,
                // more on this in a moment!
                noiseOffsetX: Math.random() * 1000,
                noiseOffsetY: Math.random() * 1000
              });
          }
          
          return points;
        }
  }

  private renderSVG(): TemplateResult {
    return html`
      <svg class='blob' viewBox="0 0 200 200">
          <defs>
              <linearGradient id="gradient" gradientTransform="rotate(90)">
                <stop id="gradientStop1" offset="0%" stop-color="${this.config.color_gradient_top}" />
                <stop id="gradientStop2 " offset="100%" stop-color="${this.config.color_gradient_bottom}" />
              </linearGradient>
          </defs>
          <path d="" fill="url('#gradient')"></path>
      </svg>
    `
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this.config.show_warning) {
      return this._showWarning(localize('common.show_warning'));
    }

    if (this.config.show_error) {
      return this._showError(localize('common.show_error'));
    }

    return html`
      <div class='header'>
        <h1 style='--mush-title-font-size: ${this.config.size ? this.config.size : null};'>
            ${this.config.show_blob ? this.renderSVG() : null}
            ${this.config.heading}
        </h1>
      </div>
    `;
  }

  private _showWarning(warning: string): TemplateResult {
    return html` <hui-warning>${warning}</hui-warning> `;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html` ${errorCard} `;
  }

  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    return css`
      :host,h1 {
          font-family: var(--google-font), inherit;
          color: var(--md-sys-color-on-surface,inherit);
          font-size: var(--mush-title-font-size, 1em);
          font-weight: var(--mush-title-font-weight, 900);
          line-height: var(--mush-title-line-height,1);
      }
      .header {
          padding: var(--mush-title-padding, 24px 12px 16px)
      }
      .header * {
          margin: 0px;
          white-space: pre-wrap;
      }
      svg {
          display: inline-block;
          height: 1em;
          width: 1em;
      }
      h1 {
          display: flex;
          flex-flow: row wrap;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 1ex;
          position:relative;
          z-index: 1;
      }
    `;
  }
}
