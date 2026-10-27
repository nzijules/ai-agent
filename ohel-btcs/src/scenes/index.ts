import type {SceneId} from '../config/scripts';
import {Scene1Hook} from './Scene1Hook';
import {Scene2Btcs} from './Scene2Btcs';
import {Scene7Cta} from './Scene7Cta';
import {SceneTodo} from './SceneTodo';
import type {SceneProps, TitlePlacement} from './types';

export const SCENES: Record<SceneId, {Component: React.FC<SceneProps>; title: TitlePlacement}> = {
  hook: {Component: Scene1Hook, title: 'bottom'},
  btcs: {Component: Scene2Btcs, title: 'top'},
  benefits: {Component: SceneTodo, title: 'top'},
  modernite: {Component: SceneTodo, title: 'bottom'},
  showcase: {Component: SceneTodo, title: 'bottom'},
  projection: {Component: SceneTodo, title: 'bottom'},
  cta: {Component: Scene7Cta, title: 'scene'},
};
