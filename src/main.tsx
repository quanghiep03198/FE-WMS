import './styles/index.css'

import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './__app.tsx'
import reportWebVitals from './report-web-vitals.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)

registerSW({ immediate: true })
reportWebVitals()
