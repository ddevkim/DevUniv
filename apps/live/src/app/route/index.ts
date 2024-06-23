import { createRouter } from '@rune-ts/server';
import { ConcurrentRoute } from '../../pages/live-1/concurrentRoute';
import { MplRoute } from '../../pages/live-2/MplRoute';
import { ObjectFeRoute } from '../../pages/live-3/ObjectFeRoute';
import { ObjectFe2Route } from '../../pages/live-4/ObjectFe2Route';
import { PixelArtRoute } from '../../projects/PixelArt/Route';

type RouterType = typeof ConcurrentRoute &
  typeof MplRoute &
  typeof ObjectFeRoute &
  typeof ObjectFe2Route &
  typeof PixelArtRoute;

export const ClientRouter = createRouter<RouterType>({
  ...ConcurrentRoute,
  ...MplRoute,
  ...ObjectFeRoute,
  ...ObjectFe2Route,
  ...PixelArtRoute,
});
