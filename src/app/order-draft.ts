export const ORDER_GOAL_GROUPS = [
  {
    label: "Followers",
    options: [
      { label: "1K", value: "1K Followers" },
      { label: "2K", value: "2K Followers" },
      { label: "5K", value: "5K Followers" },
    ],
  },
  {
    label: "Likes",
    options: [
      { label: "1K", value: "1K Likes" },
      { label: "2K", value: "2K Likes" },
      { label: "5K", value: "5K Likes" },
    ],
  },
  {
    label: "Views",
    options: [
      { label: "1K", value: "1K Views" },
      { label: "5K", value: "5K Views" },
      { label: "10K", value: "10K Views" },
    ],
  },
] as const;

export const ORDER_GOAL_OPTIONS = ORDER_GOAL_GROUPS.flatMap(
  (group) => group.options.map((option) => option.value),
);

export type OrderDraft = {
  email: string;
  name: string;
  socialLink: string;
  packages: string[];
};

export type OrderDraftErrors = Partial<Record<keyof OrderDraft, string>>;

export function createOrderDraft(initialPackage = ""): OrderDraft {
  return {
    email: "",
    name: "",
    socialLink: "",
    packages: initialPackage ? [initialPackage] : [],
  };
}

export function normalizeOrderDraft(draft: Partial<OrderDraft>): OrderDraft {
  return {
    email: typeof draft.email === "string" ? draft.email : "",
    name: typeof draft.name === "string" ? draft.name : "",
    socialLink: typeof draft.socialLink === "string" ? draft.socialLink : "",
    packages: Array.isArray(draft.packages) ? draft.packages : [],
  };
}

export function toggleOrderPackage(
  selectedPackages: string[],
  packageName: string,
  lockedPackage = "",
): string[] {
  if (packageName === lockedPackage) {
    return selectedPackages.includes(lockedPackage)
      ? selectedPackages
      : [...selectedPackages, lockedPackage];
  }

  if (selectedPackages.includes(packageName)) {
    return selectedPackages.filter(
      (selectedPackage) => selectedPackage !== packageName,
    );
  }

  return [...selectedPackages, packageName];
}

export function validateOrderDraft(draft: Partial<OrderDraft>): {
  valid: boolean;
  errors: OrderDraftErrors;
} {
  const errors: OrderDraftErrors = {};
  const normalizedDraft = normalizeOrderDraft(draft);
  const email = normalizedDraft.email.trim();

  if (!normalizedDraft.name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!email) {
    errors.email = "Enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email.";
  }

  if (!normalizedDraft.socialLink.trim()) {
    errors.socialLink = "Enter a social media page link.";
  }

  if (normalizedDraft.packages.length === 0) {
    errors.packages = "Choose at least one package.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
