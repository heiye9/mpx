import { asyncLock } from '../helper/utils'
const queue = []
const idsMap = {}
let flushing = false
let curIndex = 0
const lockTask = asyncLock()
export default function queueWatcher (watcher) {
  if (!watcher.id && typeof watcher === 'function') {
    watcher = {
      id: Infinity,
      run: watcher
    }
  }
  if (!idsMap[watcher.id] || watcher.id === Infinity) {
    idsMap[watcher.id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      let i = queue.length - 1
      while (i > curIndex && watcher.id < queue[i].id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    lockTask(flushQueue, resetQueue)
  }
}

function flushQueue () {
  flushing = true
  queue.sort((a, b) => a.id - b.id)
  for (curIndex = 0; curIndex < queue.length; curIndex++) {
    const watcher = queue[curIndex]
    idsMap[watcher.id] = null
    // 如果已经销毁，就不再执行
    watcher.destroyed || watcher.run()
  }
  resetQueue()
}

function resetQueue () {
  flushing = false
  curIndex = queue.length = 0
}
