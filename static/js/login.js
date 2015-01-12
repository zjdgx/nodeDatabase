String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g,'');
};

$('.addUser .submitUser').click(function(){
	var paw = $('input:eq(1)').val().trim(),
		pwd = $('input:eq(2)').val().trim(),
		name = $('input:eq(0)').val().trim();
		
	if (paw != pwd) {
		return false;
	} else {
		if (pwd == '' || paw == '' || name == '') {
			return false;
		} else {
			this.submit();
		}
	}
});