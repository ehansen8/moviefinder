import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Movie } from '../../types'
import MovieDetailBody from '../movies/MovieDetailBody'

type MovieDetailModalProps = {
  isShowing: boolean
  handleClose: () => void
  movie: Movie
}

export default function MovieDetailModal({
  isShowing,
  handleClose,
  movie,
}: MovieDetailModalProps) {
  return (
    <Modal
      contentClassName='text-light text-center bg-dark'
      show={isShowing}
      onHide={handleClose}
      size='lg'
    >
      <Modal.Body className=''>
        {isShowing && (
          <MovieDetailBody
            movie={movie}
            handleClose={handleClose}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='outline-light'
          onClick={handleClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
