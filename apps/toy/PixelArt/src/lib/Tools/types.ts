import type { ToolButton } from '../Components/ToolButton';

export enum ToolType {
  Circle = 'Circle',
  Rectangle = 'Rectangle',
  Pen = 'Pen',
  Brush = 'Brush',
  WaterPaint = 'WaterPaint',
}

export interface Tool {
  toolType: ToolType;
  onMouseDown: (event: paper.ToolEvent) => void;
  onMouseDrag: (event: paper.ToolEvent) => void;
  onMouseUp: (event: paper.ToolEvent) => void;
  toolButton: ToolButton;
}
