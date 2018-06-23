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

var Format = {
	bold: function(text){
		var regex = /\*\*([^\*\*]+)\*\*/g;
		return text.replace(regex, "<b>$1</b>")
	},

	italic: function(text){
		var regex = /\*([^\*]+)\*/g;
		return text.replace(regex, '<i>$1</i>');
	},

	strike: function(text){
		var regex = /~~([^~~]+)~~/g;
		return text.replace(regex, '<s>$1</s>');
	},

	Format: function(text){
		
		text = this.bold(text)
		text = this.italic(text)
		text = this.strike(text)

		return text
	}
}