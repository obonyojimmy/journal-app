import { formatRelative } from 'date-fns'

export const encodeFormData = (paramDict) => {
    const formData = new FormData()
    Object.entries(paramDict).forEach(([k, v]) => {
        formData.append(k, v)
    })
    /* for (const pair of formData.entries()) {
      console.log(pair[0], pair[1])
    } */
    return formData
}

export const timeAgo = (date?:string) => {
    if (!date) {
      return ''
    }
    const ago = formatRelative(date, new Date())
    return ago
  }