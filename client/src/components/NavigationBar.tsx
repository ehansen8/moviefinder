import React from 'react'
import { MovieSearchBar } from './MovieSearchBar'
import { Navbar, Nav, Stack } from 'react-bootstrap'
export function NavigationBar() {
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
          <Nav.Link
            className="nav-link {% if nbar == 'dashboard' %}active{% endif %}"
            aria-current='page'
            href='#'
          >
            Dashboard
          </Nav.Link>
          <Nav.Link
            className=''
            href='#'
          >
            Watch Together
          </Nav.Link>
          <Nav.Link
            className=''
            href='#'
          >
            Stats
          </Nav.Link>
          <Nav.Link
            className=''
            href='#'
          >
            Logout
          </Nav.Link>
        </Stack>
      </Nav>
    </Navbar>
  )
}
