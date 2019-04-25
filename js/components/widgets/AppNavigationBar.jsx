import React, { useState } from 'react'

import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'

import { makeStyles, useTheme } from '@material-ui/styles'

import classNames from 'classnames'


const style = (theme) => ({
  root : {
    position: 'fixed',
    width              : '100%',
    bottom             : 0,
    borderTop          : '2px solid',
    borderColor        : theme.palette.primary.main,
    height: '56px',
    overflowX: 'hidden',
    overflowY: 'auto',
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

const AppNavigationBar = ({onChange, variant, showLabel=false}) => {
  const [selection, setSelection] = useState('home')
  const theme = useTheme()
  const classes = useAppNavigationBarStyles()
  const pathname = window.location.pathname

  return (
    <BottomNavigation value={1/*selection*/} onChange={onChange}
        className={classNames(classes.root,
          variant === 'small' && classes.shrinkMore,
          variant === 'tiny' && classes.shrinkSome)}>
      {
        theme.layout.sections.map((sectionDef) => {
          const { label, path, onClick, Icon } = sectionDef
          return <BottomNavigationAction className={classes.action} key={path} label={label} showLabel={showLabel} icon={<Icon />} />
        })
      }
    </BottomNavigation>
  )
}

export { AppNavigationBar }
