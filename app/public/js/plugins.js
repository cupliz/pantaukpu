
require('./materialize.min.js')
function init (){
  console.log('init')
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems, options);
  });
	M.AutoInit()
}
module.exports = init