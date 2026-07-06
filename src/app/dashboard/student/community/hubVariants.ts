// hubVariants.ts - Centralized Framer Motion variants for Community Hub
export const hubContainerVariant = {
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] as any },
  },
};

export const tabContentVariant = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.25, 0.1, 0.25, 1.0] as any,
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] as any },
  },
};

export const slideOverLeftVariant = {
  hidden: { x: "-100%", opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.32, ease: [0.25, 0.1, 0.25, 1.0] as any },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] as any },
  },
};

export const slideOverRightVariant = {
  hidden: { x: "100%", opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.32, ease: [0.25, 0.1, 0.25, 1.0] as any },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] as any },
  },
};

export const backdropVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const listItemVariant = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.36, ease: [0.25, 0.1, 0.25, 1.0] as any },
  },
};

export const messageEntranceVariant = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};
