const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')

exports.debug = function (msg) {
  fs.appendFileSync('/Users/chemzqm/.debug', msg + '\n') }

exports.setLines = function (nvim, buf, lines, cb) {
  nvim.bufSetLines(buf, 0, lines.length, lines, cb)
}

exports.getRevs = function (directory) {
  return new Promise(resolve => {
    exec('git rev-parse --verify HEAD', {cwd: directory}, (err, stdout) => {
      if (err) return resolve('')
      resolve(stdout.replace(/\r?\n$/, ''))
    })
  })
}

exports.exec = function (cmd, cwd) {
  return new Promise(resolve => {
    exec(cmd, {cwd: cwd}, (err, stdout) => {
      if (err) return resolve('')
      stdout = stdout || ''
      resolve(stdout.replace(/\r?\n$/, '\n'))
    })
  })
}

exports.queue = function (fns, count) {
  return new Promise(function(resolve, reject) {
    let a = fns.slice(0, count)
    let b = fns.slice(count)
    let l = fns.length
    let runs = 0
    if (fns.length == 0 ) return resolve()
    for (let fn of a) {
      fn().then(() => {
        runs += 1
        if (runs == l) return resolve()
        let next = function () {
          let fn = b.shift()
          if (!fn) return
          return fn().then(() => {
            runs += 1
            if (runs == l) return resolve()
            return next()
          }, reject)
        }
        return next()
      }, reject)
    }
  })
}

exports.proc = function (process, timeout, onupdate) {
  process.stdout.setEncoding('utf8')
  function onData(data) {
    let str = data.toString()
    let lines = str.split(/\r?\n/)
    lines.forEach(line => {
      if (/\r/.test(line)) {
        let arr = line.split(/\r/)
        onupdate(arr.reverse()[0].replace(/\s+$/, ''))
      } else {
        onupdate(line.replace(/\s+$/, ''))
      }
    })
  }
  process.stderr.on('data', onData)
  process.stdout.on('data', onData)
  return new Promise(function(resolve, reject) {
    let t = setTimeout(() => {
      reject(new Error('process timeout after' + timeout + 's'))
      process.kill()
    }, timeout*1000)
    process.on('close', code => {
      clearTimeout(t)
      if (code == 0) {
        resolve()
      } else {
        reject(new Error('process exit with ' + code))
      }
    })
  })
}

let isDirectory = exports.isDirectory = function (dir) {
  return new Promise(function(resolve) {
    fs.stat(dir, (err, stat) => {
      if (err || !stat.isDirectory()) return resolve(false)
      resolve(true)
    })
  })
}

exports.isRemote = function (dir) {
  return isDirectory(path.join(dir, 'rplugin'))
}
