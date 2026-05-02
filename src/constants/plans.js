export const PLANS = {
  ORO: 'Oro',
  ESMERALDA: 'Esmeralda',
  PREMIUM: 'Premium',
};

export const PLAN_LABELS = {
  [PLANS.ORO]: 'Oro',
  [PLANS.ESMERALDA]: 'Esmeralda',
  [PLANS.PREMIUM]: 'Premium',
};

export const PLAN_COLORS = {
  [PLANS.ORO]: '#ffc107',
  [PLANS.ESMERALDA]: '#4caf50',
  [PLANS.PREMIUM]: '#9c27b0',
  default: '#3699ff',
};

export const getPlanColor = (plan) => PLAN_COLORS[plan] || PLAN_COLORS.default;
