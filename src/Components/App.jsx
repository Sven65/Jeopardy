import React, { Component } from 'react'

import './../styles/materialize.min.css'
import './../styles/main.css'

import './../General/materialize.min.js'

import { socketDebug } from '../api'
import Navbar from './Navbar'
import BeforeGame from './BeforeGame'

class App extends Component {
	constructor(props){
		super(props)

		this.state = {
			joinedUsers: [],
			questionsLoaded: false,
			roomID: "",
			user: {}
		}

		socketDebug({x: "dick"}, d => {
			console.log(d)
			this.setState({d})
			console.log(this.state)
		})

		
	}

	render(){
		return (
			<div className="App">
				<Navbar gameCode={this.props.roomID} />
				<BeforeGame hidden={false} headerText="Please enter details"/>
			</div>
		)
	}
}

export default App