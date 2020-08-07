import Reset from '../components/Reset'

const ResetPassword = (props) => (
  <Reset resetToken={props.query.resetToken} />
)

export default ResetPassword