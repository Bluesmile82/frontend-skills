import '../styles/globals.scss'
import 'react-vis/dist/style.css';

function MyApp({ Component, pageProps }) {
  return (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Baskervville&display=swap" rel="stylesheet" as="font"></link>
    <Component {...pageProps} />
  </>
  )
}

export default MyApp
