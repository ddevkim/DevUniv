import { html, Page } from 'rune-ts';
import { main as loadPixelArt } from './index';

export class PixelArtPage extends Page<object> {
  override template() {
    return html`<div></div>`;
  }

  override onRender() {
    loadPixelArt();
    this.element().remove();
  }
}
