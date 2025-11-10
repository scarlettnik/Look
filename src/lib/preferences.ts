import type { UserPreferences, UserPreferencesDraft } from '../types/domain';

export const DEFAULT_SIZE_PARAMETERS = {
  breast: 90,
  waist: 60,
  hip: 90,
} as const;

export const DEFAULT_USER_PREFERENCES_DRAFT: UserPreferencesDraft = {
  gender: 'female',
  age: 25,
  styles: [],
  clothing_size: '',
  size_parameters: { ...DEFAULT_SIZE_PARAMETERS },
  wearing_styles: [],
};

export const createPreferencesDraft = (
  preferences?: UserPreferences | null,
): UserPreferencesDraft => ({
  gender: preferences?.gender ?? DEFAULT_USER_PREFERENCES_DRAFT.gender,
  age: preferences?.age ?? DEFAULT_USER_PREFERENCES_DRAFT.age,
  styles: [...(preferences?.styles ?? DEFAULT_USER_PREFERENCES_DRAFT.styles)],
  clothing_size:
    preferences?.clothing_size ?? DEFAULT_USER_PREFERENCES_DRAFT.clothing_size,
  size_parameters: {
    breast:
      preferences?.size_parameters?.breast ??
      DEFAULT_USER_PREFERENCES_DRAFT.size_parameters.breast,
    waist:
      preferences?.size_parameters?.waist ??
      DEFAULT_USER_PREFERENCES_DRAFT.size_parameters.waist,
    hip:
      preferences?.size_parameters?.hip ??
      DEFAULT_USER_PREFERENCES_DRAFT.size_parameters.hip,
  },
  wearing_styles: [
    ...(preferences?.wearing_styles ??
      DEFAULT_USER_PREFERENCES_DRAFT.wearing_styles),
  ],
});
