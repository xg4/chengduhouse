import { Logger } from '@nestjs/common'

export class Executor<T> extends Logger {
  private queue: T[] = []
  private isRunning = false

  constructor(private executor: (data: T) => Promise<void>) {
    super(Executor.name)
  }

  run() {
    if (this.isRunning) {
      return
    }
    this.isRunning = true
    this.dispatch()
  }

  private async dispatch() {
    if (this.isEmpty) {
      this.isRunning = false
      return
    }
    const param = this.dequeue()
    const now = Date.now()
    await this.executor(param)
    this.log(`[task] ${param} +${(Date.now() - now) / 1e3}s`)
    await this.dispatch()
  }
  enqueue(value: T) {
    if (this.queue.includes(value)) {
      return
    }
    this.queue.push(value)
    this.run()
  }
  dequeue() {
    return this.queue.shift()
  }
  get first() {
    return this.queue[0]
  }
  get last() {
    return this.queue[this.queue.length - 1]
  }
  get size() {
    return this.queue.length
  }
  get isEmpty() {
    return this.size === 0
  }
}
