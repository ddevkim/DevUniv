import { createRouter } from '@rune-ts/server';
import { PixelArtRoute } from '../../pages/Route';

type RouterType = typeof PixelArtRoute;

export const ClientRouter = createRouter<RouterType>({
  ...PixelArtRoute,
});
