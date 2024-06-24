import paper from 'paper';
import { NeoMakerTool } from '../Components/NeoMakerTool';
import { ToolType } from './types';
import { ColorPicker, Slider } from './Utils/ToolPropControllers';

export class CircleTool extends NeoMakerTool {
  private _colorPicker: ColorPicker;
  private _thicknessController: Slider;

  constructor() {
    const colorPicker = new ColorPicker({ color: `#000000` });
    const thicknessController = new Slider({ title: 'Thickness', min: 1, max: 10, value: 1 });
    super(ToolType.Circle, [thicknessController, colorPicker]);
    this._colorPicker = colorPicker;
    this._thicknessController = thicknessController;
  }

  onMouseDown = (event: paper.ToolEvent) => {
    this.path = new paper.Path.Circle({
      center: event.point,
      radius: 0,
      strokeWidth: this._thicknessController.data.value,
      strokeColor: new paper.Color(this._colorPicker.data.color),
    });
  };

  onMouseDrag = (event: paper.ToolEvent) => {
    if (this.path) {
      this.path.remove();
      const radius = event.downPoint.getDistance(event.point);
      this.path = new paper.Path.Circle({
        center: event.downPoint,
        radius: radius,
        strokeWidth: this._thicknessController.data.value,
        strokeColor: new paper.Color(this._colorPicker.data.color),
      });
    }
  };

  onMouseUp = (event: paper.ToolEvent) => {
    this.path = null;
  };
}

export class RectangleTool extends NeoMakerTool {
  private _colorPicker: ColorPicker;
  private _thicknessController: Slider;

  constructor() {
    const colorPicker = new ColorPicker({ color: `#000000` });
    const thicknessController = new Slider({ title: 'Thickness', min: 1, max: 10, value: 1 });
    super(ToolType.Rectangle, [thicknessController, colorPicker]);
    this._colorPicker = colorPicker;
    this._thicknessController = thicknessController;
  }

  onMouseDown = (event: paper.ToolEvent) => {
    this.path = new paper.Path.Rectangle({
      point: event.point,
      size: [0, 0],
      strokeWidth: this._thicknessController.data.value,
      strokeColor: new paper.Color(this._colorPicker.data.color),
    });
  };

  onMouseDrag = (event: paper.ToolEvent) => {
    if (this.path) {
      this.path.remove();
      const topLeft = event.downPoint;
      const bottomRight = event.point;
      this.path = new paper.Path.Rectangle({
        from: topLeft,
        to: bottomRight,
        strokeWidth: this._thicknessController.data.value,
        strokeColor: new paper.Color(this._colorPicker.data.color),
      });
    }
  };

  onMouseUp = (event: paper.ToolEvent) => {
    this.path = null;
  };
}

export class WaterPaintTool extends NeoMakerTool {
  constructor() {
    super(ToolType.WaterPaint);
  }
  onMouseDown(event: paper.ToolEvent) {
    this.path = new paper.Path();
    this.path.fillColor = new paper.Color({
      hue: Math.random() * 360,
      saturation: 1,
      brightness: 1,
    });
    this.path.add(event.point);
  }

  onMouseDrag(event: paper.ToolEvent) {
    if (this.path) {
      const step = event.delta.divide(2);
      step.angle += 90;

      const top = event.middlePoint.add(step);
      const bottom = event.middlePoint.subtract(step);

      this.path.add(top);
      this.path.insert(0, bottom);
      this.path.smooth();
    }
  }

  onMouseUp(event: paper.ToolEvent) {
    if (this.path) {
      this.path.add(event.point);
      this.path.closed = true;
      this.path.smooth();

      this.path = null;
    }
  }
}

export class BrushTool extends NeoMakerTool {
  private _brushThickness = 30;
  private _opacityController: Slider;
  private _colorPicker: ColorPicker;

  constructor() {
    const colorPicker = new ColorPicker({ color: `#000000` });
    const opacityController = new Slider({ title: 'Opacity', min: 0, max: 1, value: 1, step: 0.1 });
    super(ToolType.Brush, [opacityController, colorPicker]);
    this._colorPicker = colorPicker;
    this._opacityController = opacityController;
  }

  onMouseDown = (event: paper.ToolEvent) => {
    paper.tool.fixedDistance = 10;

    this.path = new paper.Path();
    this.path.fillColor = hexToPaperColor(
      this._colorPicker.data.color,
      this._opacityController.data.value,
    );
  };

  onMouseDrag = (event: paper.ToolEvent) => {
    if (this.path) {
      const delta = event.delta.normalize(this._brushThickness);

      if (event.count === 0) {
        this._addPaintStrokes(event.middlePoint, delta.multiply(-1), 6);
      } else {
        const step = delta.divide(2);
        step.angle += 90;

        const top = event.middlePoint.add(step);
        const bottom = event.middlePoint.subtract(step);

        this.path.add(top);
        this.path.insert(0, bottom);

        this.path.smooth();
      }
    }
  };

  onMouseUp = (event: paper.ToolEvent) => {
    if (this.path) {
      const delta = event.point.subtract(event.lastPoint).normalize(this._brushThickness);

      this._addPaintStrokes(event.point, delta, 6);
      this.path.closed = true;
      this.path.smooth();

      this.path = null;

      paper.tool.fixedDistance = 0;
    }
  };

  private _addPaintStrokes = (point: paper.Point, delta: paper.Point, strokeEnds: number) => {
    if (this.path) {
      let step = delta.rotate(90, new paper.Point(0, 0));
      const strokePoints = strokeEnds * 2 + 1;
      point = point.subtract(step.divide(2));
      step = step.divide(strokePoints - 1);

      for (let i = 0; i < strokePoints; i++) {
        let strokePoint = point.add(step.multiply(i));
        let offset = delta.multiply(Math.random() * 0.3 + 0.1);
        if (i % 2) {
          offset = offset.multiply(-1);
        }
        strokePoint = strokePoint.add(offset);
        this.path.insert(0, strokePoint);
      }
    }
  };
}

export class PenTool extends NeoMakerTool {
  private _colorPicker: ColorPicker;
  private _thicknessController: Slider;
  private _opacityController: Slider;

  constructor() {
    const colorPicker = new ColorPicker({ color: `#000000` });
    const thicknessController = new Slider({ title: 'Thickness', min: 1, max: 50, value: 1 });
    const opacityController = new Slider({ title: 'Opacity', min: 0, max: 1, value: 1, step: 0.1 });

    super(ToolType.Pen, [thicknessController, opacityController, colorPicker]);

    this._colorPicker = colorPicker;
    this._thicknessController = thicknessController;
    this._opacityController = opacityController;
  }

  onMouseDown = (event: paper.ToolEvent) => {
    this.path = new paper.Path();
    this.path.strokeColor = hexToPaperColor(
      this._colorPicker.data.color,
      this._opacityController.data.value,
    );
    this.path.strokeWidth = this._thicknessController.data.value;
    this.path.add(event.point);
  };

  onMouseDrag = (event: paper.ToolEvent) => {
    if (this.path) {
      this.path.add(event.point);
      this.path.smooth();
    }
  };

  onMouseUp = (event: paper.ToolEvent) => {
    if (this.path) {
      this.path.add(event.point);
      this.path.smooth();
      this.path = null;
    }
  };
}

function hexToPaperColor(hex: `#${number}`, opacity: number) {
  const hexNum = hex.replace(/^#/, '');

  const r = parseInt(hexNum.substring(0, 2), 16) / 255;
  const g = parseInt(hexNum.substring(2, 4), 16) / 255;
  const b = parseInt(hexNum.substring(4, 6), 16) / 255;

  return new paper.Color(r, g, b, opacity);
}
