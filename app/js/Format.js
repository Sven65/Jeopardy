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