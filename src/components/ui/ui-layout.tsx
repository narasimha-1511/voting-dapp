'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import * as React from 'react'
import {ReactNode, Suspense, useEffect, useRef} from 'react'
import toast, {Toaster} from 'react-hot-toast'
import { 
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  alpha,
  useScrollTrigger
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import { motion, useScroll, useTransform } from 'framer-motion'

import {AccountChecker} from '../account/account-ui'
import {ClusterChecker, ClusterUiSelect, ExplorerLink} from '../cluster/cluster-ui'
import {WalletButton} from '../solana/solana-provider'

export function UiLayout({ children, links }: { children: ReactNode; links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  const { scrollY } = useScroll()
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(28, 29, 33, 0.95)', 'rgba(28, 29, 33, 0.98)']
  )

  const NavLinks = () => (
    <>
      {links.map(({ label, path }) => (
        <Button
          key={path}
          component={Link}
          href={path}
          sx={{
            mx: 1,
            color: '#F1E3E4',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: pathname.startsWith(path) ? '100%' : '0%',
              height: '2px',
              bottom: 0,
              left: 0,
              backgroundColor: '#A288A6',
              transition: 'width 0.3s ease-in-out'
            },
            '&:hover': {
              backgroundColor: 'rgba(162, 136, 166, 0.1)',
              '&::after': {
                width: '100%'
              }
            },
            ...(pathname.startsWith(path) && {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(162, 136, 166, 0.1)',
                borderRadius: 1,
              }
            })
          }}
        >
          <motion.span
            initial={{ y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        </Button>
      ))}
    </>
  )

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <HowToVoteIcon sx={{ mr: 1 }} />
        Voting
      </Typography>
      <List>
        {links.map(({ label, path }) => (
          <ListItem 
            key={path} 
            component={Link}
            href={path}
            sx={{
              backgroundColor: pathname.startsWith(path) 
                ? alpha(theme.palette.primary.main, 0.1)
                : 'transparent'
            }}
          >
            <ListItemText 
              primary={label} 
              sx={{ 
                textAlign: 'center',
                color: pathname.startsWith(path) 
                  ? theme.palette.primary.main
                  : theme.palette.text.primary
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          backgroundColor: headerBg,
        }}
      >
        <AppBar 
          position="static" 
          elevation={trigger ? 4 : 0}
          sx={{ 
            background: 'transparent',
            transition: 'all 0.3s',
            backdropFilter: trigger ? 'blur(20px)' : 'none',
            borderBottom: trigger ? '1px solid rgba(241, 227, 228, 0.1)' : 'none',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    mr: 2,
                    color: '#F1E3E4',
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HowToVoteIcon sx={{ 
                  display: { xs: 'none', md: 'flex' }, 
                  mr: 1,
                  color: '#A288A6',
                }} />
                <Typography
                  variant="h6"
                  noWrap
                  component={Link}
                  href="/"
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 700,
                    color: '#F1E3E4',
                    textDecoration: 'none',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Voting
                </Typography>
                
                {!isMobile && <NavLinks />}
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                '& .wallet-adapter-button': {
                  backgroundColor: '#A288A6',
                  color: '#1C1D21',
                  '&:hover': {
                    backgroundColor: '#BB9BB0',
                  }
                }
              }}>
                <WalletButton />
                <ClusterUiSelect />
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </motion.div>

      <Box sx={{ height: { xs: '64px', sm: '64px' } }} />

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Suspense
          fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography>Loading...</Typography>
            </Box>
          }
        >
          {children}
        </Suspense>
      </Box>

      <Toaster position="bottom-right" />
    </Box>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button className="btn btn-xs lg:btn-md btn-primary" onClick={submit} disabled={submitDisabled}>
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? <h1 className="text-5xl font-bold">{title}</h1> : title}
          {typeof subtitle === 'string' ? <p className="py-6">{subtitle}</p> : subtitle}
          {children}
        </div>
      </div>
    </div>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
  }
  return str
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink path={`tx/${signature}`} label={'View Transaction'} className="btn btn-xs btn-primary" />
      </div>,
    )
  }
}
