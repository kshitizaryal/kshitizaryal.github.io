const fs = require('fs')
const pkg = require('./package.json')
const filename = 'src/static/assets/css/style.css'
const script = fs.readFileSync(filename)
const padStart = (str) => ('0' + str).slice(-2)
const dateObj = new Date()
const date = `${dateObj.getFullYear()}-${padStart(
  dateObj.getMonth() + 1
)}-${padStart(dateObj.getDate())}`
const banner = `/*!
 * ${pkg.title} (${pkg.url})
 * Copyright ${dateObj.getFullYear()} ${pkg.author}
 * Licensed under ${
   pkg.license
 } (https://github.com/KshitizAryal/kshitizaryal.github.io/blob/main/LICENSE)
 */
`

if (script.slice(0, 3) != '/**') {
  fs.writeFileSync(filename, banner + script)
}
