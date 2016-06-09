import React, { Component } from 'react';
import { Link } from 'react-router';

class AppContainer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default AppContainer;