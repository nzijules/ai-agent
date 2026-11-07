import React from 'react';
import {SceneId} from '../data/timeline';
import {TransitionKind} from '../components/LightTransition';
import {S01Dawn, S02Breakfast, S03Work, S04Pensive} from './S01_S04';
import {
  S05Ribbon, S06Anatomy, S07Healthy, S08Generations, S09Consultation, S10BloodTest,
  S11NotDiagnosis, S12EarlyDetection, S13Couple, S14Family, S15Signature,
} from './S05_S15';

/** Association scène → composant + type de transition d'entrée. */
export const SCENE_COMPONENTS: Record<SceneId, {Component: React.FC; transition: TransitionKind; origin?: {x: string; y: string}}> = {
  S01: {Component: S01Dawn, transition: 'dissolve'},
  S02: {Component: S02Breakfast, transition: 'flare'},
  S03: {Component: S03Work, transition: 'wipe'},
  S04: {Component: S04Pensive, transition: 'dissolve'},
  S05: {Component: S05Ribbon, transition: 'iris', origin: {x: '50%', y: '30%'}},
  S06: {Component: S06Anatomy, transition: 'dissolve'},
  S07: {Component: S07Healthy, transition: 'wipe'},
  S08: {Component: S08Generations, transition: 'flare'},
  S09: {Component: S09Consultation, transition: 'wipe'},
  S10: {Component: S10BloodTest, transition: 'iris'},
  S11: {Component: S11NotDiagnosis, transition: 'dissolve'},
  S12: {Component: S12EarlyDetection, transition: 'flare'},
  S13: {Component: S13Couple, transition: 'rise'},
  S14: {Component: S14Family, transition: 'flare'},
  S15: {Component: S15Signature, transition: 'iris', origin: {x: '50%', y: '35%'}},
};
