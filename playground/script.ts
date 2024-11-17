import an from '../src/index'
import myPlugin from './plugin'
import { tip } from './toast'

// const an = $

an.use(myPlugin)
an.use(tip)

an('.showtip').click(() => {
  tip('你好呀')
})

an('.click1').click(() => {
  an('.click2').click(() => console.log('click 2' + Math.random()))
})

console.dir(an('.click2'))

an('.click3').click(() => {
  an('.click2').off('click')
})

an('.hide').click(() => {
  console.log('click1122')
  an('.list').css.toggle()
})

an('.code')

an('.cssadd').click(() => {
  // download(logo)
  an.css('myid', 'p { color: red; }')
})

an('.cssadd1').click(() => {
  an.css('p { color: blue; }')
})

an('.cssdel').on('click', () => {
  an.css.remove('myid')
})

an('.cssclear').on('click', () => {
  an.css.clear()
})

console.dir(an)

an('li').class.set('todo')
const $app = an('#app')
  .css('color: red;')
  .css('font-size: 20px;')
  .css({ color: 'blue' })
  .css('color: red;')
  .css('color: #33cc99; font-weight: 700;')
  .class('my-class')
// .mycolor("#3c9")
// .class("")

console.log(an('.li3').parent())

// console.log($app.attr("id"), $app.children())

const $child = an(`<header>header here <button class="btn">button</button> </header>`)

$child.parent($app).text()

// $(".btn", $app).on("click", function (e) {
//   console.log(this, e)
// })
$child.$('.btn').on('click', () => {})

console.log('$.n', an.version, $child)

for (const $li of an('li').es) {
  // console.log("li: ", $li)
}
