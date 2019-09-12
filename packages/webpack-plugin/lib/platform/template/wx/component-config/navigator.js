const TAG_NAME = 'navigator'

module.exports = function ({ print }) {
  const aliValueLogError = print({ platform: 'ali', tag: TAG_NAME, isError: true, type: 'value' })
  const aliPropLog = print({ platform: 'ali', tag: TAG_NAME, isError: false })
  const aliPropLogError = print({ platform: 'ali', tag: TAG_NAME, isError: true })
  const aliEventLog = print({ platform: 'ali', tag: TAG_NAME, isError: false, type: 'event' })
  const ttPropLog = print({ platform: 'bytedance', tag: TAG_NAME, isError: false })
  const ttEventLog = print({ platform: 'bytedance', tag: TAG_NAME, isError: false, type: 'event' })

  return {
    test: TAG_NAME,
    props: [
      {
        test: /^(target|delta|app-id|path|extra-data|version|hover-stop-propagation)$/,
        ali: aliPropLogError
      },
      {
        test: 'open-type',
        ali (attr) {
          let supportedList = ['navigate', 'redirect', 'switchTab', 'navigateBack']
          if (supportedList.indexOf(attr.value) === -1) {
            aliValueLogError(attr)
          }
        }
      },
      {
        test: /^(hover-stop-propagation)$/,
        ali: aliPropLog
      },
      {
        test: /^(target|app-id|path|extra-data|version)$/,
        tt: ttPropLog
      }
    ],
    event: [
      {
        test: /^(success|fail|complete)$/,
        ali: aliEventLog,
        tt: ttEventLog
      }
    ]
  }
}
