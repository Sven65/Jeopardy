import $ from "jquery";

document.addEventListener('DOMContentLoaded', function() { 
	let instances = M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {coverTrigger: false, constrainWidth: false})
	//M.Modal.init(document.querySelectorAll('.modal'))
	M.Tabs.init(document.querySelectorAll('.tabs'))

	/*document.querySelector("#usermodal-trigger").addEventListener("click", e => {
		document.querySelector("#usermodal-holder").classList.remove("hidden")
	})*/
})

$(document).ready(function() {
	let panelOne = $('.user-modal-form-panel.two').height(),
		panelTwo = $('.user-modal-form-panel.two')[0].scrollHeight

	$('.user-modal-form-panel.two').not('.user-modal-form-panel.two.active').on('click', e => {
		e.preventDefault()

		$('.user-modal-form-toggle').addClass('visible')
		$('.user-modal-form-panel.one').addClass('hidden')
		$('.user-modal-form-panel.two').addClass('active')
		$('.user-modal-form').animate({
			'height': panelTwo
		}, 200)
	})

	$('.user-modal-form-toggle').on('click', function(e) {
		e.preventDefault()
		$(this).removeClass('visible')
		$('.user-modal-form-panel.one').removeClass('hidden')
		$('.user-modal-form-panel.two').removeClass('active')
		$('.user-modal-form').animate({
			'height': panelOne
		}, 200)
	})

	$('.user-modal-form-panel.two').not('.user-modal-form-panel.two.active').click()
	$('.user-modal-form-toggle').click()
	$('.user-modal-form-toggle').click()

	$('#usermodal-holder').hide()

	$("#usermodal-trigger").on('click', e => {
		e.preventDefault()
		$("#usermodal-holder").show()
	})

	$(document).mouseup(e => {
		if(e.target.classList.contains("loader-holder") || e.target.classList.contains("modal-content")){
			$("#usermodal-holder").hide()
		}
	})
})