import { NeoMaker } from './Neomaker';
import {
  BrushTool,
  CircleTool,
  PenTool,
  RectangleTool,
  WaterPaintTool,
} from '../lib/Tools/NeoMakerTools';

export function main() {
  const size = {
    width: 1600,
    height: 1024,
  };
  const tools = [
    new PenTool(),
    new CircleTool(),
    new RectangleTool(),
    new BrushTool(),
    new WaterPaintTool(),
  ];

  const neoMaker = new NeoMaker({ id: 1, size, tools });
  document.body.querySelector('#body')!.appendChild(neoMaker.render());
}
