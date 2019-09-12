const TAG_NAME = 'view'

module.exports = function ({ print }) {
  /**
   * @type {function(isError: (number|boolean|string)?): void} aliLog
   * @desc - 无法转换时告知用户的通用方法，接受0个或1个参数，意为是否error级别
   */
  return {
    // 匹配标签名，可传递正则
    test: TAG_NAME,
    // 支付宝标签名转换函数，如无差异可忽略
    // ali () {
    //   return 'a:view'
    // },
    // 组件属性中的差异部分
    // props: [
    //   {
    //     test: /^aria-(role|label)$/,
    //     // 当遇到微信支持而支付宝不支持的特性时，转换函数可以只抛出错误或警告而不返回值
    //     ali: aliLog(1)
    //   }
    // ],
    // 组件事件中的差异部分
    // 微信中基础事件有touchstart|touchmove|touchcancel|touchend|tap|longpress|longtap|transitionend|animationstart|animationiteration|animationend|touchforcechange
    // 支付宝中的基础事件有touchStart|touchMove|touchEnd|touchCancel|tap|longTap

    event: [
      {
        // 支付宝中的view组件额外支持了transitionEnd|animationStart|animationIteration|animationEnd，故在此声明了组件事件转换逻辑
        test: /^(transitionend|animationstart|animationiteration|animationend)$/,
        //
        ali (eventName) {
          const eventMap = {
            'transitionend': 'transitionEnd',
            'animationstart': 'animationStart',
            'animationiteration': 'animationIteration',
            'animationend': 'animationEnd'
          }
          return eventMap[eventName]
        }
      }
    ]
  }
}
