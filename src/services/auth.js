import { api } from 'boot/axios'

export const signUp = async username => {
  try {
    const response = await api.post('/users', { username })

    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const signIn = async passphrase => {
  try {
    const response = await api.post('/auth/sign-in', { passphrase })

    if (response.data.token) {
      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.data.token}`
      localStorage.setItem('token', response.data.token)

      return response.data.user
    } else {
      return null
    }
  } catch (error) {
    console.error(error)
  }
}
