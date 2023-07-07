const goToOms = (token: string, oms: string) => {
  const link = (oms.startsWith('http') ? oms.replace('api/', "") : `https://${oms}.hotwax.io/`) + `?token=${token}`
  window.open(link, '_blank', 'noopener, noreferrer')
}

export {
  goToOms
}