/* global describe, it, expect */
const fs = require('fs')

const RecordTape = class RecordTape {
  constructor (config) {
    this._path = `${config.path}.json`
  }

  loadSync () {
    const content = fs.readFileSync(this._path, 'utf8')

    const data = JSON.parse(content)

    return data
  }

  saveSync (data) {
    const content = JSON.stringify(data)

    fs.writeFileSync(this._path, content, 'utf8')

    return data
  }

  startRecording () {}

  replayRecording () {}
}

RecordTape.testTape = (suiteName, tape, testFn) => {
  describe('Sample', function () {
    const tapeData = tape.loadSync()

    for (const record of tapeData.log) {
      it(`Test input ${JSON.stringify(record.input)}, should ${record.error ? 'fail' : 'give output'}`, async function () {
        let result, error
        try {
          result = await testFn(record.input)
        } catch (e) {
          error = e
        }

        if (record.output) {
          expect(error).to.equal(undefined)
          expect(record.output).to.deep.equal(result)
        }

        if (record.error) {
          expect(result).to.equal(undefined)
          expect(record.error).to.deep.equal(error.message)
        }
      })
    }
  })
}

module.exports = RecordTape
