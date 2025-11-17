import {
  DEFAULT_SIZE_PARAMETERS,
  DEFAULT_USER_PREFERENCES_DRAFT,
  createPreferencesDraft,
} from '../preferences';

describe('createPreferencesDraft', () => {
  it('uses default onboarding values when preferences are missing', () => {
    expect(createPreferencesDraft(null)).toEqual(DEFAULT_USER_PREFERENCES_DRAFT);
  });

  it('merges partial preferences with defaults', () => {
    expect(
      createPreferencesDraft({
        age: 31,
        styles: ['minimalist'],
        size_parameters: {
          breast: 92,
          waist: 68,
          hip: 96,
        },
      }),
    ).toEqual({
      gender: 'female',
      age: 31,
      styles: ['minimalist'],
      clothing_size: '',
      size_parameters: {
        breast: 92,
        waist: 68,
        hip: 96,
      },
      wearing_styles: [],
    });
  });

  it('returns independent arrays and nested size objects for editing drafts', () => {
    const preferences = {
      styles: ['office siren'],
      wearing_styles: ['oversize'],
      size_parameters: { ...DEFAULT_SIZE_PARAMETERS },
    };
    const draft = createPreferencesDraft(preferences);

    draft.styles.push('minimalist');
    draft.wearing_styles.push('regular');
    draft.size_parameters.waist = 65;

    expect(preferences.styles).toEqual(['office siren']);
    expect(preferences.wearing_styles).toEqual(['oversize']);
    expect(preferences.size_parameters.waist).toBe(DEFAULT_SIZE_PARAMETERS.waist);
  });
});
