import { Await as AwaitBase } from '@liquid-labs/react-await'

const Await = (props) =>
  <AwaitBase spinner={CenteredProgress} blocked={() => null} {...props} />
