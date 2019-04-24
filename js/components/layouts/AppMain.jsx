import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Grid from '@material-ui/core/Grid'

import { makeStyles } from '@material-ui/styles'
import { mainPaddingStyles } from '@liquid-labs/react-viewport-context'

const styles = (theme) => ({
  root : {
    flexGrow  : 1,
    overflowY : 'auto',
    overflowX : 'hidden',
    position  : 'relative', // make this the container for position elements
  }
})

const useStyles = makeStyles(styles)
const useMainPaddingStyles = makeStyles(mainPaddingStyles)

const AppMain = ({children, className, ...props}) => {
  const classes = useStyles()
  const paddingClasses = useMainPaddingStyles()

  className = classNames(
    classes.root,
    paddingClasses.mainPaddingSides,
    paddingClasses.mainPaddingTop,
    paddingClasses.mainPaddingBottom,
    className)

  return (
    <Grid id="main"
        container
        direction="column"
        wrap="nowrap"
        className={className}
        {...props}>
      { children }
    </Grid>
  )
}

if (process.env.NODE_ENV !== 'production') {
  AppMain.propTypes = {
    children  : PropTypes.node.isRequired,
    className : PropTypes.string
  }
}

export { AppMain }
