import React, { Component } from 'react'
import Button from './../Common/Button'

class BoardListing extends Component {
	constructor(props){
		super(props)

		this.state = {
			isCopied: false
		}

		this.copyID = this.copyID.bind(this)
	}

	copyToClipboard(str){
		const el = document.createElement('textarea')
		el.value = str
		el.setAttribute('readonly', '')
		el.style.position = 'absolute';
		el.style.left = '-9999px'
		document.body.appendChild(el)
		const selected = document.getSelection().rangeCount>0?document.getSelection().getRangeAt(0):false
		el.select()
		document.execCommand('copy')
		document.body.removeChild(el)
		if (selected) {
			document.getSelection().removeAllRanges()
			document.getSelection().addRange(selected)
		}
	}

	copyID(id){
		if(this.props.isCreate){
			return
		}
		this.copyToClipboard(id)

		this.setState({isCopied: true})

		setTimeout(() => this.setState({isCopied: false}), 1000);
	}

	render(){
		let isCopied = this.state.isCopied

		return (
			<div className="column">
				<nav className="panel">
					<p className="panel-heading" >
						<span onClick={() => this.props.boardNameEdit(this.props.id)}>{this.props.boardName}</span>
					</p>

					<a className="panel-block" onClick={() => this.copyID(this.props.id)}>
						<span className="boardID">Board ID: {this.props.id}</span>
						<span className={"copy-notification "+(isCopied?"":'hidden')}>Copied to clipboard!</span>
						
					</a>

					<a className="panel-block" onClick={() => this.props.editBoard(this.props.id)}>
						<span className="is-right">
							<span className="icon is-left">
								<i className="mdi mdi-pencil"></i>
							</span>
							{this.props.isCreate?'Create':'Edit'}
						</span>
					</a>

					<a className="panel-block" onClick={() => this.props.onDelete(this.props.id)}>
						<span className="is-right">
							<span className="icon is-left">
								<i className="mdi mdi-close"></i>
							</span>
							Delete
						</span>
					</a>
				</nav>
			</div>
		)
	}
}

export default BoardListing