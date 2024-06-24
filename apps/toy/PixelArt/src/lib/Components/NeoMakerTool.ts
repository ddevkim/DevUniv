import type { Tool, ToolType } from '../Tools/types';
import { ToolButton } from './ToolButton';
import { html, View } from 'rune-ts';
import { ToolButtonPressed, ToolTypeChanged } from '../Events/EventTypes';
import { each, filter, find, pipe, take } from '@fxts/core';

export abstract class NeoMakerTool implements Tool {
  toolButton: ToolButton;
  propControllers: View[];
  protected path: paper.Path | null = null;

  abstract onMouseDown(event: paper.ToolEvent): void;
  abstract onMouseDrag(event: paper.ToolEvent): void;
  abstract onMouseUp(event: paper.ToolEvent): void;

  protected constructor(
    public toolType: ToolType,
    public propControllerViews?: View[],
  ) {
    this.toolButton = new ToolButton({ toolType, on: false });
    this.propControllers = propControllerViews ?? [];
  }
}

export class MakerToolList<T extends NeoMakerTool[], D extends T[number]['toolType']> extends View<{
  tools: T;
  defaultToolType: D;
}> {
  public currentTool: NeoMakerTool = this.getCurrentTool(this.data.defaultToolType);

  public toolButtonViewList: ToolButton[] = this.data.tools.map((tool) => tool.toolButton);

  override template() {
    return html` <div>${this.toolButtonViewList}</div> `;
  }

  protected override onRender() {
    this._setDefaultButtonOn();
    this.delegate(ToolButtonPressed, ToolButton, (_, toolButtonView) => {
      this._switchToolType(toolButtonView.data.toolType);
    });
  }

  getCurrentTool(toolType: ToolType) {
    const currentTool = this.data.tools.find((tool) => tool.toolType === toolType);

    if (!currentTool) throw new Error(`Cannot find tool`);
    return currentTool;
  }

  private _syncCurrentTool(toolType: ToolType) {
    this.currentTool = this.getCurrentTool(toolType);
  }

  private _setDefaultButtonOn() {
    pipe(
      this.toolButtonViewList,
      find((buttonView) => buttonView.data.toolType === this.data.defaultToolType),
      (buttonView) => buttonView?.setOn(true),
    );
  }

  private _switchToolType(toolType: ToolType) {
    pipe(
      this.toolButtonViewList,
      filter((buttonView) => buttonView.data.on || buttonView.data.toolType === toolType),
      take(2),
      each((buttonView) => buttonView.setOn(!buttonView.data.on)),
    );
    this._syncCurrentTool(toolType);
    this._dispatchToolSwitchingEvent();
  }

  private _dispatchToolSwitchingEvent() {
    this.dispatchEvent(ToolTypeChanged, {
      bubbles: true,
    });
  }
}
