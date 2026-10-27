import type {SceneId} from '../config/scripts';
import {Scene1Hook} from './Scene1Hook';
import {Scene2Btcs} from './Scene2Btcs';
import {Scene3Benefits} from './Scene3Benefits';
import {Scene4Modernite} from './Scene4Modernite';
import {Scene5Showcase} from './Scene5Showcase';
import {Scene6Projection} from './Scene6Projection';
import {Scene7Cta} from './Scene7Cta';
import type {SceneProps, TitlePlacement} from './types';

export const SCENES: Record<SceneId, {Component: React.FC<SceneProps>; title: TitlePlacement}> = {
  hook: {Component: Scene1Hook, title: 'bottom'},
  btcs: {Component: Scene2Btcs, title: 'bottom'},
  benefits: {Component: Scene3Benefits, title: 'bottom'},
  modernite: {Component: Scene4Modernite, title: 'bottom'},
  showcase: {Component: Scene5Showcase, title: 'bottom'},
  projection: {Component: Scene6Projection, title: 'bottom'},
  cta: {Component: Scene7Cta, title: 'scene'},
};
