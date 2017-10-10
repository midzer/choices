export const addItem = (
  value,
  label,
  id,
  choiceId,
  groupId,
  customProperties,
  placeholder,
  keyCode,
) => ({
  type: 'ADD_ITEM',
  value,
  label,
  id,
  choiceId,
  groupId,
  customProperties,
  placeholder,
  keyCode,
});

export const removeItem = (id, choiceId) => ({
  type: 'REMOVE_ITEM',
  id,
  choiceId,
});

export const highlightItem = (id, highlighted) => ({
  type: 'HIGHLIGHT_ITEM',
  id,
  highlighted,
});
