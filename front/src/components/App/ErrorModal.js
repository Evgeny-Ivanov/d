import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'

const ErrorModal = () => (
      <Modal>
        <Modal.Header>Ошибка</Modal.Header>
        <Modal.Content image>
          <Image wrapped size='medium' src='http://blog.dpcoftexas.com/wp-content/uploads/2017/01/HomerSimpson.png' />
          <Modal.Description>
            <div id="error-modal-content" />
          </Modal.Description>
        </Modal.Content>
      </Modal>
);

export default ErrorModal;