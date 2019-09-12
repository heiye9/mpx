const compiler = require('../../../lib/template-compiler/compiler')

const errorFn = jest.fn(console.error)
const warnFn = jest.fn(console.warn)

function compileAndParse (input, { srcMode, mode } = { srcMode: 'wx', mode: 'ali' }) {
  const parsed = compiler.parse(input, {
    usingComponents: [],
    srcMode,
    mode,
    warn: warnFn,
    error: errorFn
  })
  const ast = parsed.root
  return compiler.serialize(ast)
}

describe('template should transform correct', function () {
  it('should transform normally in ali env', function () {
    const input = `<wxs module="m1" src="./test.wxs"></wxs>
<view>123</view>
    `

    expect(compileAndParse(input)).toBe('<import-sjs name="m1" from="./test.wxs"></import-sjs> <view>123</view> ')
    expect(errorFn).not.toHaveBeenCalled()
  })

  it('should warning if button\'s open-type is a variable', function () {
    const input = `<button open-type="{{ aaa }}" bindTap="handleClick"></button>`
    compileAndParse(input)
    expect(warnFn).toHaveBeenCalledWith(`<button>'s property 'open-type' does not support '[{{ aaa }}]' value in ali environment!`)
  })

  it('should not report error about transform if node removed', () => {
    const input = `
    <view>test</view>
    <live-pusher wx:if="{{__mpx_mode__ === 'wx'}}"></live-pusher>
    `
    compileAndParse(input)
    expect(errorFn).not.toHaveBeenCalled()

    const normalInput = `
    <map covers="123">test</map>
    `
    compileAndParse(normalInput)
    expect(warnFn).toHaveBeenCalled()
  })

  it('should not report error when parent node removed', () => {
    const input = `
    <view>test</view>
    <view wx:if="{{__mpx_mode__ === 'wx'}}">
        <live-pusher></live-pusher>
    </view>
    `
    compileAndParse(input)
    expect(errorFn).not.toHaveBeenCalled()
  })

  it('should optimize key of for in swan', function () {
    const input1 = `<view wx:for="{{list}}" wx:key="unique">123</view>`
    const input2 = `<view wx:for="{{list}}">123</view>`
    const input3 = `<view wx:for="{{list}}" wx:for-item="t1">123</view>`
    const input4 = `<view wx:for="{{list}}" wx:for-index="t1">123</view>`
    const input5 = `<view wx:for="{{list}}" wx:for-item="t1" wx:for-index="t2">123</view>`
    const input6 = `<view wx:for="{{list}}" wx:for-item="t1" wx:for-index="t2" wx:key="u1">123</view>`

    const output1 = compileAndParse(input1, { srcMode: 'wx', mode: 'swan' })
    const output2 = compileAndParse(input2, { srcMode: 'wx', mode: 'swan' })
    const output3 = compileAndParse(input3, { srcMode: 'wx', mode: 'swan' })
    const output4 = compileAndParse(input4, { srcMode: 'wx', mode: 'swan' })
    const output5 = compileAndParse(input5, { srcMode: 'wx', mode: 'swan' })
    const output6 = compileAndParse(input6, { srcMode: 'wx', mode: 'swan' })

    expect(output1).toBe('<view s-for="item, index in list trackBy item.unique">123</view>')
    expect(output2).toBe('<view s-for="item, index in list">123</view>')
    expect(output3).toBe('<view s-for="t1, index in list">123</view>')
    expect(output4).toBe('<view s-for="item, t1 in list">123</view>')
    expect(output5).toBe('<view s-for="t1, t2 in list">123</view>')
    expect(output6).toBe('<view s-for="t1, t2 in list trackBy t1.u1">123</view>')
  })
})
