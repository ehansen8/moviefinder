import { Navbar, Nav, Stack } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MovieSearchBar } from './MovieSearchBar'

export function NavigationBar() {
  const router = useRouter()
  const activeLink = (url: string) => (router.pathname === url ? 'active' : '')

  const links = [
    {
      text: 'Dashboard',
      url: '/Dashboard',
    },
    {
      text: 'Watch Together',
      url: '/WatchTogether',
    },
    {
      text: 'Stats',
      url: '/Stats',
    },
    {
      text: 'Logout',
      url: '/Logout',
    },
  ]

  return (
    <Navbar
      bg='dark'
      variant='dark'
      sticky='top'
      className='justify-content-between'
    >
      <Navbar.Brand className='ms-2 '>Movie Picker</Navbar.Brand>

      <div className='nav col-4 d-flex flex-column'>
        <MovieSearchBar onSubmit={() => {}} />
      </div>

      <Nav>
        <Stack
          direction='horizontal'
          gap={3}
          className='me-4'
        >
          {links.map((link, idx) => {
            return (
              <Link
                key={idx}
                href={link.url}
                className={`nav-link ${activeLink(link.url)}`}
              >
                {link.text}
              </Link>
            )
          })}
        </Stack>
      </Nav>
    </Navbar>
  )
}
