import React from 'react';
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
} from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline'
import { Feedback } from '../ui/Feedback'
import Typography from '@material-ui/core/Typography'

import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  root : {
    height         : '100vh',
    minWidth       : '100%',
    '@media print' : {
      display : 'none',
    }
  }
})

/*
 * We setup the header and bottom navigation as fixed elements using flexbox.
 * This can probably be replicated using 'Grid's and the fact that the header
 * is rendered as part of the AppSwitch result is not idea... but it's how we
 * get the top toolbar to match up with the main content. The techinque is
 * based off this: https://codepen.io/anthonyLukes/pen/DLBeE by Anthony Lukes
 *
 * Any child components will be rendered beneath the BottomNavigation component.
 * In practice, this is primarily intended for dialog components that are
 * are either hidden or rendered absolutely.
 */

class AppFrameBase extends React.Component {
  render() {
    const {ContentSwitch, BottomNavigation, classes} = this.props;
    return (
      <Router>
        <Typography component="div" className={classes.root}>
          <CssBaseline />
          <Feedback />
          <div style={{display : 'flex', flexDirection : 'column', height : '100%'}}>
            <div style={{flex : '1 1 auto', display : 'flex', flexDirection : 'column'}}>
              <ContentSwitch />
            </div>
            <div style={{flex : '0 0 auto'}}>
              <BottomNavigation />
            </div>
          </div>
          {this.props.children}
        </Typography>
      </Router>
    )
  }
}

AppFrameBase.propTypes = {
  ContentSwitch    : PropTypes.func.isRequired,
  BottomNavigation : PropTypes.func.isRequired,
  children         : PropTypes.node,
  classes : PropTypes.object.isRequired,
}

const AppFrame = withStyles(styles)(AppFrameBase)

export { AppFrame }
