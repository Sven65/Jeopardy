import React, { Component } from 'react'
import Button from './../Common/Button'

class BoardListing extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className="column">
				<nav className="panel">
					<p className="panel-heading" >
						<span onClick={() => this.props.boardNameEdit(this.props.id)}>{this.props.boardName}</span>
						
					</p>

					<a className="panel-block">
						Board ID: {this.props.id}
					</a>

					<a className="panel-block" onClick={() => this.props.editBoard(this.props.id)}>
						<span className="is-right">
							<span className="icon is-left">
								<i className="mdi mdi-pencil"></i>
							</span>
							Edit
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