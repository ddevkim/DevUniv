import { html, View } from 'rune-ts';

export class PropControllerList extends View<{ propControllerViews: View[] }> {
  override template() {
    return html` <div>${this.data.propControllerViews.map((view) => html`${view}`)}</div> `;
  }

  changeControllers(controllerViews: View[]) {
    this.data.propControllerViews = controllerViews;
    this.redraw();
  }
}

interface Color {
  color: `#${number}`;
}

export class ColorPicker extends View<Color> {
  constructor(data?: Color) {
    super(data ?? { color: `#000000` });
  }
  override template() {
    return html` <input class="color-picker" type="color" value="${this.data.color}" />`;
  }

  protected override onRender() {
    this.addEventListener('change', (e) => {
      const color = (e.target as HTMLInputElement).value as Color['color'];
      this.setColor({ color });
    });
  }

  setColor(newColor: Color) {
    this.data.color = newColor.color;
    (this.element() as HTMLInputElement).value = newColor.color;
    this.redraw();
  }
}

interface SliderData {
  title: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
}

export class Slider extends View<SliderData> {
  constructor(data?: SliderData) {
    super({ title: '', value: 1, min: 1, max: 10, step: 1, ...data });
  }

  override template() {
    return html`
      <label
        >${this.data.title}
        <input
          class="title"
          type="range"
          min="${this.data.min}"
          max="${this.data.max}"
          step="${this.data.step}"
          value="${this.data.value}"
        />
      </label>
    `;
  }

  protected override onRender() {
    this.addEventListener('input', (e) => {
      const value = +(e.target as HTMLInputElement).value;
      this.setValue(value);
    });
  }

  setValue(newValue: number) {
    this.data.value = newValue;
    (this.element() as HTMLInputElement).value = `${newValue}`;
    // this.redraw();
  }
}
