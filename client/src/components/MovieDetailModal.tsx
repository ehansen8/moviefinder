import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

type MovieDetailModalProps = {
  isShowing: boolean
  handleClose: () => void
}

export default function MovieDetailModal({
  isShowing,
  handleClose,
}: MovieDetailModalProps) {
  return (
    <Modal
      contentClassName='text-light text-center bg-dark'
      show={isShowing}
      onHide={handleClose}
      size='lg'
    >
      <Modal.Body className=''>Hello Random Text</Modal.Body>
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
