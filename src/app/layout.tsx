'use client'
import './globals.css'
import {ClusterProvider} from '@/components/cluster/cluster-data-access'
import {SolanaProvider} from '@/components/solana/solana-provider'
import {UiLayout} from '@/components/ui/ui-layout'
import {ReactQueryProvider} from './react-query-provider'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '@/theme/theme'


const links: { label: string; path: string }[] = [
  { label: 'Account', path: '/account' },
  // { label: 'Clusters', path: '/clusters' },
  { label: 'Voting Program', path: '/voting' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ReactQueryProvider>
        <ClusterProvider>
          <SolanaProvider>
            <UiLayout links={links}>{children}</UiLayout>
          </SolanaProvider>
        </ClusterProvider>
      </ReactQueryProvider>
    </ThemeProvider>
    </body>
    </html>
  )
}
