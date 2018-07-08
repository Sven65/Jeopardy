import createHistory from 'history/createBrowserHistory'

function parseQueryString(query) {
	let obj = {}
	let qPos = query.indexOf("?")
	let tokens = query.substr(qPos + 1).split('&')
	let i = tokens.length - 1

	if(qPos !== -1 || query.indexOf("=") !== -1){
		for (; i >= 0; i--) {
			let s = tokens[i].split('=')
			obj[unescape(s[0])] = s.hasOwnProperty(1) ? unescape(s[1]) : null
		}
	}
	return obj
}

export default createHistory();
export {parseQueryString}