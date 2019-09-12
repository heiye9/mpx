import { BEFORECREATE, CREATED, UPDATED } from '../../../core/innerLifecycle'

const APP_HOOKS = [
  'onLaunch',
  'onShow',
  'onHide',
  'onError'
]

const PAGE_HOOKS = [
  'onLoad',
  'onReady',
  'onShow',
  'onHide',
  'onUnload',
  'onPullDownRefresh',
  'onReachBottom',
  'onShareAppMessage',
  'onPageScroll',
  'onTitleClick',
  'onOptionMenuClick',
  'onUpdated',
  'onBeforeCreate'
]

const COMPONENT_HOOKS = [
  'onInit',
  'deriveDataFromProps',
  'didMount',
  'didUpdate',
  'didUnmount',
  'pageShow',
  'pageHide',
  'updated',
  'beforeCreate'
]

export const lifecycleProxyMap = {
  [BEFORECREATE]: ['beforeCreate', 'onBeforeCreate'],
  [CREATED]: ['onLoad'],
  [UPDATED]: ['updated', 'onUpdated']
}

export const LIFECYCLE = {
  APP_HOOKS,
  PAGE_HOOKS,
  COMPONENT_HOOKS
}
