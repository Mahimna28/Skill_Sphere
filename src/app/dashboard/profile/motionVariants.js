export const containerVariant = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] } }
};

export const rowVariant = {
  hidden: { opacity: 0, x: 40 },
  show: i => ({
    opacity: 1,
    x: 0,
    transition: { delay: (i || 0) * 0.06, duration: 0.36, ease: [0.25, 0.1, 0.25, 1.0] }
  })
};

export const microVariant = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1.0] } }
};
