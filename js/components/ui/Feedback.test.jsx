/* global afterEach describe expect jest test */
import React, { useContext } from 'react'
import { act, cleanup, render, waitForElement } from 'react-testing-library'

import { Feedback, FeedbackContext } from './Feedback'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

import { createCatalystTheme } from '@liquid-labs/catalyst-theme'

const catalystTheme = createCatalystTheme()

function renderFeedback(feedback) {
  const renderUtils = render(
    <MuiThemeProvider theme={catalystTheme}>
      {feedback}
    </MuiThemeProvider>)
  const rerender = (feedback) => renderUtils.rerender(
    <MuiThemeProvider theme={catalystTheme}>
      {feedback}
    </MuiThemeProvider>)
  return {
    ...renderUtils,
    rerender
  }
}

let feedbackFuncs = {}
const FeedbackGenerator = () => {
  const
    feedbackAPI = useContext(FeedbackContext)
  feedbackFuncs = feedbackAPI

  return (
    <>
      <div data-testid="hasAddInfoMessage">{ Boolean(feedbackAPI.addInfoMessage).toString() }</div>
      <div data-testid="hasAddErrorMessage">{ Boolean(feedbackAPI.addErrorMessage).toString() }</div>
    </>
  )
}

describe('Feedback', () => {
  jest.useFakeTimers()

  afterEach(() => {
    feedbackFuncs = {}
    cleanup()
  })

  test("should provide feedback API to children through context", () => {
    const { getByTestId } = renderFeedback(
      <Feedback><FeedbackGenerator /></Feedback>
    )
    expect(getByTestId('hasAddInfoMessage').textContent).toBe('true')
    expect(getByTestId('hasAddErrorMessage').textContent).toBe('true')
    expect(Boolean(feedbackFuncs.addInfoMessage)).toBe(true)
    expect(Boolean(feedbackFuncs.addErrorMessage)).toBe(true)
  })

  test("should update and display info message when 'addInfoMessage' is called", async() => {
    const { getByText } = renderFeedback(
      <Feedback><FeedbackGenerator /></Feedback>
    )
    act(() => { feedbackFuncs.addInfoMessage('Hi there!') })
    await waitForElement(() => getByText('Hi there!'))
    expect(getByText('Hi there!')).toBeTruthy()
  })

  test("should remove and auto-hide info messages after 'autoHideDuration'", () => {
    const { queryByText, container } = renderFeedback(
      <Feedback autoHideDuration={1000} transitionDuration={{ exit : 1, enter : 1 }}><FeedbackGenerator /></Feedback>
    )
    act(() => { feedbackFuncs.addInfoMessage('Hello!') })
    expect(queryByText('Hello!')).toBeTruthy()
    act(() => jest.advanceTimersByTime(500))
    expect(container.querySelector(['[class^="MuiSnackbar"]'])).toBeTruthy()
    expect(queryByText('Hello!')).toBeTruthy()
    // to trigger the hide
    act(() => jest.advanceTimersByTime(500))
    // for the transition
    act(() => jest.advanceTimersByTime(1))
    expect(container.querySelector(['[class^="MuiSnackbar"]'])).toBeNull()
    expect(queryByText('Hello!')).toBeNull()
  })
})
