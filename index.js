const fs = require('fs')

const testTape = require('./utils/test-tape')

const RecordTape = class RecordTape {
  constructor (config = {}) {
    this._path = `${config.path}.json`
    this._log = []
    this._boundaries = {}
  }

  _formatData () {
    return {
      log: this._log,
      boundaries: this._boundaries
    }
  }

  // Data functions
  getData () {
    return this._formatData()
  }

  addLogItem (item) {
    if (
      (item.input && item.output) ||
      (item.input && item.error)
    ) {
      return this._log.push(item)
    }
  }

  addBoundaryData (boundaryName, callData) {
    const boundaries = this._boundaries
    if (!boundaries[boundaryName]) {
      boundaries[boundaryName] = []
    }

    // ToDo: implement clean up of repeated inputs
    const boundary = boundaries[boundaryName]
    boundary.unshift(callData)
  }

  // Load save functions
  async load () {
    const readFile = fs.promises.readFile
    const content = await readFile(this._path, 'utf8')

    const data = JSON.parse(content)

    this._log = data.log
    this._boundaries = data.boundaries

    return data
  }

  loadSync () {
    const content = fs.readFileSync(this._path, 'utf8')

    const data = JSON.parse(content)

    this._log = data.log
    this._boundaries = data.boundaries

    return data
  }

  async save () {
    const writeFile = fs.promises.writeFile
    const data = this._formatData()
    const content = JSON.stringify(data, null, 2)

    await writeFile(this._path, content, 'utf8')

    return data
  }

  saveSync () {
    const data = this._formatData()
    const content = JSON.stringify(data, null, 2)

    fs.writeFileSync(this._path, content, 'utf8')

    return data
  }
}

RecordTape.testTape = testTape

module.exports = RecordTape
