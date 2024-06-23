import { type LayoutData, MetaView } from '@rune-ts/server';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { PixelArtPage } from './Page';

export const pixelArtRenderHandler: RenderHandlerType<typeof PixelArtPage> = (
  createObjectFePage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
      html: {
        ...res.locals.layoutData.html,
        class: 'pixel-art',
      },
    };

    res.send(new MetaView(createObjectFePage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
