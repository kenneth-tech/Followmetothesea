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
  name: string;
  socialLink: string;
  packages: string[];
};

export type OrderDraftErrors = Partial<Record<keyof OrderDraft, string>>;

export function createOrderDraft(initialPackage = ""): OrderDraft {
  return {
    name: "",
    socialLink: "",
    packages: initialPackage ? [initialPackage] : [],
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

  if (draft.packages.length === 0) {
    errors.packages = "Choose at least one package.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
