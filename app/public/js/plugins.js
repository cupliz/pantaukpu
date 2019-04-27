require('./jquery-3.3.1.min.js')
require('./materialize.min.js')
function start (){
  M.AutoInit()
  $(document).ready(function(){
    $('.materialboxed').materialbox();
  });
}
module.exports = start