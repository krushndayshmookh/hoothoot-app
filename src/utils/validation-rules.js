const usernameRules = [
  // ensure username is not empty
  value => value.length > 0 || 'username is required',

  // ensure username is between 6 and 32 characters
  value => value.length <= 32 || 'username should be less than 32 characters',
  value => value.length >= 6 || 'username should be at least 6 characters',

  // ensure aplhanumeric characters only
  value =>
    /^[a-zA-Z0-9]+$/.test(value) ||
    'username can only contain alphanumeric characters',
]

const rules = {
  username: usernameRules,
}

export default rules
