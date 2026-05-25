# Design Philosophy: The Layered Living Journal

The application is a **calm, writing-first spatial journal**. All features must align with this core identity.

## Core Principles

1.  **Unified Mixed-Media Surface**: Writing, drawings, images, painted backgrounds, and annotations must coexist naturally on the same surface. Avoid mode-switching friction; the surface should feel like a real notebook with mixed materials.
2.  **Writing as Primary**: Writing always remains the dominant layer. All other media (images, paint, drawings) support text, not dominate it.
3.  **Emergent Structure**: Do not force rigid templates, database blocks, or UI-heavy page builders. Structure (sections, timelines, dividers) should emerge naturally from user interactions (drawing lines, arranging content).
4.  **Calm Interface**: The interface should feel invisible. Tools appear contextually, and complexity is hidden until needed. Prioritize emotional calmness and visual stability.
5.  **Typography Maturity**: Typography must be conservative and optimized for long-duration readability. Avoid trendy, futuristic, or overly thin fonts. Maintain high contrast at comfortable scales.
6.  **Layered Stability (Non-Destructive)**: Changes (like painting behind text or annotating a screenshot) must be non-destructive and spatially persistent.
7.  **Handcrafted Feel**: Aim for the feeling of a physical object—warm, personal, and stable. Avoid sterile software aesthetics.

## Implementation Guide

- **Layers**: Handle media and annotations with care to preserve text readability (opacity balance, blend modes).
- **Interactions**: Keep toolbars hidden/contextual. Structure tools (dividers) should feel lightweight.
- **Typography**: Refer to the typography phase instructions (Phases 276-290).
