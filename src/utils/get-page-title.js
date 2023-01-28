import defaultSettings from '@/settings'

const title = defaultSettings.title || 'DOSIV'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
