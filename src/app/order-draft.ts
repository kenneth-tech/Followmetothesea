export const ORDER_GOAL_OPTIONS = [
  "1K Followers",
  "2K Followers",
  "5K Followers",
  "1K Likes",
  "2K Likes",
  "5K Likes",
  "1K Views",
  "5K Views",
  "10K Views",
] as const;

export type OrderDraft = {
  name: string;
  socialLink: string;
  goal: string;
};

export type OrderDraftErrors = Partial<Record<keyof OrderDraft, string>>;

export function createOrderDraft(initialGoal = ""): OrderDraft {
  return {
    name: "",
    socialLink: "",
    goal: initialGoal,
  };
}

export function validateOrderDraft(draft: OrderDraft): {
  valid: boolean;
  errors: OrderDraftErrors;
} {
  const errors: OrderDraftErrors = {};

  if (!draft.name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!draft.socialLink.trim()) {
    errors.socialLink = "Enter a social media page link.";
  }

  if (!draft.goal.trim()) {
    errors.goal = "Enter your goal.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
