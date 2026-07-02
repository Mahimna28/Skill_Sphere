# Revert Animation System Plan

The goal is to completely remove Framer Motion and all entrance/scroll animations from the public pages, while strictly preserving the new cream/navy/gold design, the glassmorphism header, active page highlighting, and all hover states.

## User Review Required

> [!WARNING]
> You asked to **completely delete** files like `Header.tsx`, `Footer.tsx`, `LandingPageClient.tsx`, and the other page clients. However, these files actually contain the cream/navy/gold redesign and the interactive profile dropdown/glassmorphism that you explicitly want to keep. They were not created exclusively for the animation system; they were modified to include animations.
> 
> If I completely delete them and revert `page.tsx` and `layout.tsx` to their original git state, you will lose the cream/navy/gold redesign on those pages and revert to the old neo-brutalism design.

## Proposed Changes

Instead of blindly deleting these structural files and breaking the design, I propose the following approach to safely remove all animations while keeping the redesign:

### 1. [DELETE] Animation Primitives
I will completely delete the files that were strictly created for the animation system:
- `src/lib/animations.ts`
- `src/components/animations/FadeIn.tsx`
- `src/components/animations/SlideUp.tsx`
- `src/components/animations/StaggerContainer.tsx`
- `src/components/animations/CountUp.tsx`
- `src/components/animations/ParallaxWrapper.tsx`
- `src/components/layout/HeaderFooterWrapper.tsx`

### 2. [MODIFY] Strip Animations from Page Clients
Instead of deleting the page clients and reverting to the old design, I will meticulously strip out every instance of `framer-motion`, `<motion.div>`, `whileInView`, `initial`, `animate`, etc., from the following files, converting them back to static HTML elements with CSS hover effects:
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/home/LandingPageClient.tsx`
- `src/app/about/AboutPageClient.tsx`
- `src/app/courses/CoursesPageClient.tsx`
- `src/app/blog/BlogPageClient.tsx`
- `src/app/blog/[slug]/BlogPostClient.tsx`

### 3. [MODIFY] Layout Integration
- `src/app/layout.tsx`: Remove `HeaderFooterWrapper` and directly use the static `Header` and `Footer`.

This approach guarantees that the public pages will load instantly with zero entrance/scroll animations, but they will still look beautiful with the new cream/navy/gold design and retain CSS-based hover interactivity.

## Open Questions

> [!IMPORTANT]
> Do you approve this safer approach to strip the animations out of the client components rather than deleting them entirely? (Deleting them would destroy the cream/navy/gold redesign for those pages).
