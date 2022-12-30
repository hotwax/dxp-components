import { createLogger, StringifyObjectsHook, LoggerHook, LogEvent } from 'vue-logger-plugin'
import axios from 'axios'

const ServerLogHook: LoggerHook = {
  async run(event: LogEvent) {
    await axios.post('/log', { severity: event.level, data: event.argumentArray })
  }
}

const logger = createLogger({
  enabled: true,
  level: 'debug',  
  beforeHooks: [ StringifyObjectsHook ],
  afterHooks: [ ServerLogHook ]
})

export default logger