import { html, View } from 'rune-ts';
import { ToolButtonPressed } from '../Events/EventTypes';
import type { ToolType } from '../Tools/types';

export class ToolButton extends View<{ toolType: ToolType; on: boolean }> {
  override template() {
    return html`
      <button class="${this.data.on ? 'on' : ''} " name="${this.data.toolType}">
        ${this.data.toolType}
      </button>
    `;
  }

  public setOn(on: boolean) {
    this.data.on = on;
    this.element().classList.toggle('on', on);
  }

  protected override onRender() {
    this.addEventListener('click', () => {
      !this.data.on && this._dispatchPressedEvent();
    });
  }

  private _dispatchPressedEvent() {
    this.dispatchEvent(ToolButtonPressed, {
      bubbles: true,
      detail: { toolType: this.data.toolType },
    });
  }
}
