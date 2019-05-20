import React, { useState } from 'react'
import PropTypes from 'prop-types'

import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'

import { makeStyles, useTheme } from '@material-ui/styles'
import { withRouter } from 'react-router-dom'

import classNames from 'classnames'

const style = (theme) => ({
  root : {
    position           : 'fixed',
    width              : '100%',
    bottom             : 0,
    borderTop          : '2px solid',
    borderColor        : theme.palette.primary.main,
    height             : '56px',
    overflowX          : 'hidden',
    overflowY          : 'auto',
    '&$shrinkSome > *' : {
      [theme.breakpoints.down('xs')] : {
        minWidth : '65px',
        '& span' : {
          fontSize : '0.75rem'
        }
      }
    },
    '&$shrinkMore > *' : {
      [theme.breakpoints.down('xs')] : {
        minWidth : '55px',
        '& span' : {
          fontSize : '0.70rem'
        }
      }
    }
  },
  shrinkSome : {},
  shrinkMore : {},

  action : {
    fontFamily    : "'Open Sans'",
    fontWeight    : 700,
    textTransform : "uppercase"
  },
})

const useAppNavigationBarStyles = makeStyles(style)

const AppNavigationBar = withRouter(({history, location, onChange, variant, showLabel=false}) => {
  const [selection, setSelection] = useState('home')
  const theme = useTheme()
  const classes = useAppNavigationBarStyles()

  const defOnClick = (path) => {
    setSelection(path)
    history.push(path)
  }

  return <>
    { theme.layout.navigation.visible
      && <div id="appNavFrame" style={{position : 'fixed', width : '100%'}}>
        <BottomNavigation value={selection} onChange={onChange}
            className={classNames(classes.root,
              variant === 'small' && classes.shrinkMore,
              variant === 'tiny' && classes.shrinkSome)}>
          {
            theme.sections && theme.sections.map((sectionDef) => {
              const { label, path, onClick, Icon } = sectionDef
              return <BottomNavigationAction
                  className={classes.action}
                  key={path}
                  label={label}
                  onClick={onClick || (() => defOnClick(path))}
                  value={path}
                  showLabel={showLabel}
                  icon={<Icon />} />
            })
          }
        </BottomNavigation>
      </div>
    }
  </>
})

if (process.env.NODE_ENV !== 'production') {
  AppNavigationBar.propTypes = {
    onChange  : PropTypes.func,
    showLabel : PropTypes.bool,
    variant   : PropTypes.oneOf(['small', 'tiny'])
  }
}

export { AppNavigationBar }
