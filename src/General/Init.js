import $ from "jquery";

document.addEventListener('DOMContentLoaded', function() { 
	// Get all "navbar-burger" elements
	let $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)

	// Check if there are any navbar burgers
	if ($navbarBurgers.length > 0) {

		// Add a click event on each of them
		$navbarBurgers.forEach(function ($el) {
			$el.addEventListener('click', function () {

				// Get the target from the "data-target" attribute
				var target = $el.dataset.target
				var $target = document.getElementById(target)

				// Toggle the class on both the "navbar-burger" and the "navbar-menu"
				$el.classList.toggle('is-active')
				$target.classList.toggle('is-active')

			})
		})
	}
})

$(document).ready(function() {
	//$('#usermodal-holder').hide()

	let panelOne = $('.user-modal-form-panel.two').height(),
		panelTwo = $('.user-modal-form-panel.two')[0].scrollHeight

	$('.user-modal-form-panel.two').not('.user-modal-form-panel.two.active').on('click', e => {
		if(e.target.nodeName !== "INPUT" && e.target.nodeName !== "INPUT" && e.target.nodeName !== "A" && e.target.nodeName !== "LABEL"){
			e.preventDefault()

			$('.user-modal-form-toggle').addClass('visible')
			$('.user-modal-form-panel.one').addClass('hidden')
			$('.user-modal-form-panel.two').addClass('active')
			$('.user-modal-form').animate({
				'height': panelTwo+50
			}, 200)
		}
	})

	$('.user-modal-form-toggle').on('click', function(e) {
		e.preventDefault()

		$(this).removeClass('visible')
		$('.user-modal-form-panel.one').removeClass('hidden')
		$('.user-modal-form-panel.two').removeClass('active')
		$('.user-modal-form').animate({
			'height': panelOne+50
		}, 100)
	})

	$('.user-modal-form-group-error').addClass("hidden")

	$("#usermodal-trigger").on('click', e => {
		e.preventDefault()
		let isActive = $("#usermodal-holder").data("isActive")

		if(isActive === undefined){
			isActive = true
		}

		if(isActive){
			$("#usermodal-holder").show()
		}
	})

	$(document).mouseup(e => {
		if(e.target.classList.contains("loader-holder") || e.target.classList.contains("modal-content")){
			$("#usermodal-holder").hide()
		}
	})

	$('#usermodal-holder').on("SET_HEIGHT", e => {
		$('#usermodal-holder').show()
		panelOne = $('.user-modal-form-panel.two').height(),
		panelTwo = $('.user-modal-form-panel.two')[0].scrollHeight

		$('.user-modal-form').css({
			'height': panelTwo+50
		})

		$('.user-modal-form').css({
			'height': panelOne+50
		})
	})

	$('#usermodal-holder').on("USER_FORM_DONE", e => {
		setTimeout(() => {
			let event = new Event('closeUserForm', { bubbles: true });
			document.querySelector("#main-nav").dispatchEvent(event);

			//$("#main-nav").hide()
			$("#usermodal-holder").hide()
			$("#usermodal-holder").data("isActive", false)
		}, 1000)
	})

	$('#usermodal-holder').on("USER_FORM_UNDONE", e => {
		$("#usermodal-holder").data("isActive", true)
	})

	$('#register-trigger').on("click", e => {
		$('.user-modal-form-panel.two').not('.user-modal-form-panel.two.active').click()
	})

	(adsbygoogle = window.adsbygoogle || []).push({})
})