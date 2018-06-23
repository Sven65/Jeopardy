/*
Copyright Mackan <mackan@discorddungeons.me>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Creates a new DOMStuff instance
 * @constructor
 * @param {string|HTMLElement} element - The query selector or HTMLElement to perform the actions on
 * @returns DOMStuffConstructor
 * @author Mackan
 */
var DOMStuff = (function(){
	var DOMStuff = function(element){
		return new DOMStuffConstructor(element);
	}

	var DOMStuffConstructor = function(element){
		this.element = element;
		if(typeof element === "string"){
			this.DOMElement = document.querySelector(element);
		}else if(element instanceof HTMLElement){
			this.DOMElement = element;
		}
		return this;
	}

	DOMStuff.fn = DOMStuffConstructor.prototype = {

		/**
		 * Adds a class to the element
		 * @function
		 * @param {string} className - The classname to add to the element
		 * @returns {DOMStuffConstructor} - For chaining
		 * @author Mackan
		 */
		addClass: function(className){
			if (this.DOMElement.classList){
				this.DOMElement.classList.add(className);
			}else{
				this.DOMElement.className += ' ' + className;
			}

			return this;
		},

		/**
		 * Removes a class from the element
		 * @function
		 * @param {string} className - The classname to remove to the element
		 * @returns {DOMStuffConstructor} - For chaining
		 * @author Mackan
		 */
		removeClass: function(className){
			if (this.DOMElement.classList){
				this.DOMElement.classList.remove(className);
			}else{
				this.DOMElement.className = this.DOMElement.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}

			return this;
		},

		/**
		 * Checks if the element is scrolled into the view of the user
		 * @function
		 * @returns {boolean} isVisible - Whether the element is scrolled into the view or not
		 * @author Mackan
		 */
		isScrolledIntoView: function(){
			var elemTop = this.DOMElement.getBoundingClientRect().top;
			var elemBottom = this.DOMElement.getBoundingClientRect().bottom;

			var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
			return isVisible;
		},

		/**
		 * Checks if the element has a class
		 * @function
		 * @param {string} className - The class to check for
		 * @returns {boolean} hasClass - If the element has the class
		 * @author Mackan
		 */
		hasClass: function(className){
			if(this.DOMElement.classList){
				return this.DOMElement.classList.contains(className);
			}else{
				return new RegExp('(^| )' + className + '( |$)', 'gi').test(this.DOMElement.className);
			}
		},

		/** Adds an event listener to the element
		 * @function
		 * @param {string} event - The event to listen for
		 * @param {function} cb - The callback function to call
		 * @author Mackan
		 */
		on: function(event, cb){
			this.DOMElement.addEventListener(event, cb)
		},

		/** Gets all children of the current element
		 * @function
		 * @param {string} element - The element to search for
		 * @returns {Array.<DOMElement>}
		 * @author Mackan
		 */
		getChildren: function(element){
			return this.DOMElement.querySelectorAll(element)
		},

		/** Changes the elements style
		 * @function
		 * @param {string} property - The css property to change
		 * @param {string} value - The css value to change to
		 * @author Mackan
		 */
		style: function(property, value){
			this.DOMElement.style[property] = value
		},

		/** Gets the DOM element
		 * @function
		 * @returns {DOMElement}
		 * @author Mackan
		 */
		getHTMLElement: function(){
			return this.DOMElement
		}
	}

	return DOMStuff;
})();