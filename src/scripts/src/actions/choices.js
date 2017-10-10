export const addChoice = (
  value,
  label,
  id,
  groupId,
  disabled,
  elementId,
  customProperties,
  placeholder,
  keyCode,
) => ({
  type: 'ADD_CHOICE',
  value,
  label,
  id,
  groupId,
  disabled,
  elementId,
  customProperties,
  placeholder,
  keyCode,
});

export const filterChoices = results => ({
  type: 'FILTER_CHOICES',
  results,
});

export const activateChoices = (active = true) => ({
  type: 'ACTIVATE_CHOICES',
  active,
});

export const clearChoices = () => ({
  type: 'CLEAR_CHOICES',
});
