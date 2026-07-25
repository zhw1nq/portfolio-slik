export const useCurrentDomain = () => {
  const requestUrl = useRequestURL()
  
  const domain = computed(() => {
    let host = ''
    if (process.client && typeof window !== 'undefined') {
      host = window.location.host || requestUrl.host || ''
    } else {
      host = requestUrl.host || ''
    }

    if (!host || host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('192.')) {
      return 'vhming.dev'
    }
    return host
  })

  const uppercaseDomain = computed(() => {
    return domain.value.toUpperCase()
  })

  return {
    domain,
    uppercaseDomain,
    rawDomain: domain,
  }
}
