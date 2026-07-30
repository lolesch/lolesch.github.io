import type { ComponentType } from 'react';
import { RollhausArchitecture } from '@/components/figures/rollhaus-architecture';
import type { FigureId } from '@/content/types';

// The content data names a figure; this is where the name becomes a component.
// Record<FigureId, ...> means adding a FigureId without a component fails the
// build.
export const FIGURES: Record<FigureId, ComponentType> = {
  'rollhaus-architecture': RollhausArchitecture,
};
