const TAG_NAME = 'button'

module.exports = function ({ print }) {
  const aliValueLogError = print({ platform: 'ali', tag: TAG_NAME, isError: true, type: 'value' })
  const aliValueLog = print({ platform: 'ali', tag: TAG_NAME, isError: false, type: 'value' })
  const aliPropLog = print({ platform: 'ali', tag: TAG_NAME, isError: false })
  const aliEventLog = print({ platform: 'ali', tag: TAG_NAME, isError: false, type: 'event' })
  const baiduValueLogError = print({ platform: 'baidu', tag: TAG_NAME, isError: true, type: 'value' })
  const baiduPropLog = print({ platform: 'baidu', tag: TAG_NAME, isError: false })
  const baiduEventLog = print({ platform: 'baidu', tag: TAG_NAME, isError: false })
  const qqPropLog = print({ platform: 'qq', tag: TAG_NAME, isError: false })
  const qqEventLog = print({ platform: 'qq', tag: TAG_NAME, isError: false, type: 'event' })
  const qqValueLogError = print({ platform: 'qq', tag: TAG_NAME, isError: true, type: 'value' })
  const ttPropLog = print({ platform: 'bytedance', tag: TAG_NAME, isError: false })
  const ttValueLogError = print({ platform: 'bytedance', tag: TAG_NAME, isError: true, type: 'value' })
  const ttEventLog = print({ platform: 'bytedance', tag: TAG_NAME, isError: false, type: 'event' })

  return {
    test: TAG_NAME,
    props: [
      {
        test: 'open-type',
        ali ({ name, value }) {
          if (value === 'share' || value === 'launchApp') {
            // do nothing
          } else if (value === 'getPhoneNumber') {
            return [
              {
                name: 'open-type',
                value: 'getAuthorize'
              },
              {
                name: 'scope',
                value: 'phoneNumber'
              }
            ]
          } else if (/\{\{((?:.|\n)+?)\}\}(?!})/.test(value)) {
            // 如果是个变量，报warning
            aliValueLog({ name, value })
          } else {
            aliValueLogError({ name, value })
          }
        },
        swan ({ name, value }) {
          let supportList = ['contact', 'share', 'getUserInfo', 'getPhoneNumber', 'openSetting']
          if (supportList.indexOf(value) === -1) {
            baiduValueLogError({ name, value })
          }
        },
        qq ({ name, value }) {
          let supportList = ['share', 'getUserInfo', 'launchApp', 'feedback', 'openSetting']
          if (supportList.indexOf(value) === -1) {
            qqValueLogError({ name, value })
          }
        },
        tt ({ name, value }) {
          let supportList = ['share']
          if (supportList.indexOf(value) === -1) {
            ttValueLogError({ name, value })
          }
        }
      },
      {
        test: /^(lang|session-from|send-message-title|send-message-path|send-message-img|show-message-card)$/,
        ali: aliPropLog,
        swan: baiduPropLog
      },
      {
        test: /^(app-parameter)$/,
        swan: baiduPropLog
      },
      {
        test: /^(session-from|send-message-title|send-message-path|send-message-img|show-message-card)$/,
        qq: qqPropLog
      },
      {
        test: /^(plain|lang|session-from|send-message-title|send-message-path|send-message-img|app-parameter|show-message-card)$/,
        tt: ttPropLog
      }
    ],
    event: [
      {
        test: 'getphonenumber',
        ali () {
          return 'getAuthorize'
        }
      },
      {
        test: /^(getuserinfo|contact|error|launchapp|opensetting)$/,
        ali: aliEventLog
      },
      {
        test: /^(contact|error|launchapp)$/,
        swan: baiduEventLog
      },
      {
        test: /^(contact)$/,
        qq: qqEventLog
      },
      {
        test: /^(getuserinfo|contact|getphonenumbe|error|launchapp|opensetting)$/,
        tt: ttEventLog
      }
    ]
  }
}
