import { CustomEventWithDetail, CustomEventWithoutDetail } from 'rune-ts';
import type { ToolType } from '../Tools/types';

export class ToolButtonPressed extends CustomEventWithDetail<{ toolType: ToolType }> {}
export class ToolTypeChanged extends CustomEventWithoutDetail {}
