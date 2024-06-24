import paper from 'paper';
import { html, View } from 'rune-ts';
import { MakerToolList, NeoMakerTool } from '../lib/Components/NeoMakerTool';
import { ToolTypeChanged } from '../lib/Events/EventTypes';
import { PropControllerList, Slider } from '../lib/Tools/Utils/ToolPropControllers';

interface NeoMakerData {
  id: number;
  size: {
    width: number;
    height: number;
  };
  tools: NeoMakerTool[];
}

export class NeoMaker extends View<NeoMakerData> {
  readonly _canvas = document.createElement('canvas');
  readonly _toolList = new MakerToolList({
    tools: this.data.tools,
    defaultToolType: this.data.tools[0].toolType,
  });
  readonly _propControllerList = new PropControllerList({
    propControllerViews: this._toolList.currentTool.propControllers,
  });

  private _paperTool = new paper.Tool();

  constructor(public makerProps: NeoMakerData) {
    super(makerProps);
    this._initPaperCanvas({ ...makerProps.size, canvas: this._canvas });
  }

  override template() {
    return html` <div>${this._toolList}${this._propControllerList}</div> `;
  }

  protected override onRender() {
    this.element().append(this._canvas);
    this.addEventListener(ToolTypeChanged, () => {
      this._toolChanged();
    });
  }

  private _toolChanged() {
    const tool = this._toolList.currentTool;
    this._setupCanvasEventHandlers(tool);
    this._propControllerList.changeControllers(tool.propControllers);
  }

  private _initPaperCanvas({ width, height, canvas }) {
    canvas.width = width;
    canvas.height = height;
    paper.setup(canvas);
    this._setupCanvasEventHandlers(this._toolList.currentTool);
  }

  private _setupCanvasEventHandlers(tool: NeoMakerTool) {
    this._paperTool.onMouseDown = tool.onMouseDown;
    this._paperTool.onMouseDrag = tool.onMouseDrag;
    this._paperTool.onMouseUp = tool.onMouseUp;
  }
}
