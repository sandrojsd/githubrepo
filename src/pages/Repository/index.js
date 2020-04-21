/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/static-property-placement */
import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import {Browser} from './styles';

export default class Repository extends Component {
  // static propTypes = {
  //   route: PropTypes.shape(Object).isRequired,
  // };

  render() {
    //   const {
    //     route: {
    //       params: {repository},
    //     },
    //   } = this.props;

    return <Browser source={{uri: 'https://google.com'}} />;
  }
}
