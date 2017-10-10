/* eslint-disable import/prefer-default-export */
export const addGroup = (value, id, active, disabled) => ({
  type: 'ADD_GROUP',
  value,
  id,
  active,
  disabled,
});
