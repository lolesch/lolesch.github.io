import type { ComponentType } from 'react';
import { GlyphsheroChain } from '@/components/figures/glyphshero-chain';
import { RollhausSlots } from '@/components/figures/rollhaus-slots';
import type { FigureId } from '@/content/types';

// The content data names a figure; this is where the name becomes a component.
// Record<FigureId, ...> means adding a FigureId without a component fails the
// build.
export const FIGURES: Record<FigureId, ComponentType> = {
  'rollhaus-slots': RollhausSlots,
  'glyphshero-chain': GlyphsheroChain,
};
