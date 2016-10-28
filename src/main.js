import HelloWorld from 'templates/hello_world.html'
import _ from 'lodash'
import $ from 'jquery'

const template = _.template(HelloWorld)
$('body').append(template({ title: ENV.HELLO_WORLD }))
