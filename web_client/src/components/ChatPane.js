import React from 'react';
import { Parse } from 'parse';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Button, Modal } from 'react-bootstrap';
import Message from '../parse/classes/Message';
import { getClient } from '../parse/utils';

import '../App.css';
import './styles/ChatPane.css';

function renderChatMessage(m) {
  const { username, text } = m.attributes;
  const timestamp = m.createdAt.toLocaleString();
  return (
    <div key={`${username}-${m.createdAt.getTime()}`}>
      <div className="messageTop">
        <span>{username}</span>
        <span>{timestamp}</span>
      </div>
      <p>{text}</p>
    </div>
  );
}

class ChatPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      messages: [],
      inputVal: '',
      modal: null,
    };
    this.scrollbar = React.createRef();

    this.onSend = this.onSend.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  async componentDidMount() {
    // Keep attempting to scroll to the bottom until the scrollbar actually updates
    // (it fails until the document has rendered)
    const tryScrollBottom = () => {
      if (this.scrollbar.current.getValues().top === 1) {
        return;
      }
      this.scrollbar.current.scrollToBottom();
      setTimeout(() => tryScrollBottom(), 25);
    };
    tryScrollBottom();

    const client = await getClient();
    const query = new Parse.Query(Message);
    query.descending('createdAt').limit(100);
    this.subscription = await client.subscribe(query);

    // ['create', 'open', 'enter', 'update', 'leave', 'delete', 'close'].forEach(e => {
    //   subscription.on(e, message => {
    //     // message variable is the new Messages class row created in DB
    //     console.log('On', e, message);
    //   });
    // });

    this.subscription.on('open', () => {
      this.setState({ isLoading: false });
    });

    this.subscription.on('create', (parseObj) => {
      const scrollPosition = this.scrollbar.current.getValues().top;
      const { messages } = this.state;
      this.setState({ messages: [...messages, parseObj] }, () => {
        // Scroll to the bottom if and only if we were already at the bottom
        if (scrollPosition === 1) {
          this.scrollbar.current.scrollToBottom();
        }
      });
    });

    const messages = await query.find();
    this.setState({ messages: messages.reverse(), isLoading: false });
  }

  async componentWillUnmount() {
    // NOTE: We can't unsubscribe by calling subscription.unsubscribe.
    // It doesn't work even though it should!
    const client = await getClient();
    client.unsubscribe(this.subscription);
  }

  async onSend(e) {
    e.preventDefault();
    const { inputVal } = this.state;
    const { history, me } = this.props;
    const submitVal = inputVal.trim();
    if (submitVal === '') return;
    if (me == null) {
      this.setState({
        modal: {
          title: 'Need to login',
          body: 'You need to login to chat',
          buttons:
  <>
    <Button
      variant="primary"
      onClick={() => {
        history.push('login');
      }}
    >
Login
    </Button>
    <Button
      variant="primary"
      onClick={() => {
        history.push('register');
      }}
    >
Register
    </Button>
  </>,
        },
      });
      return;
    } if (me.get('emailVerified') !== true) {
      this.setState({
        modal: {
          title: 'Need to verify account',
          body: 'You need to verify your email to chat',
          buttons:
  <>
    <Button
      variant="primary"
      onClick={() => {
        history.push('verifyEmail');
      }}
    >
Verify Email
    </Button>
  </>,
        },
      });
      return;
    }
    this.scrollbar.current.scrollToBottom();
    if (submitVal === '') return;
    const message = new Message();
    message.set('text', inputVal);
    message.set('username', me.getUsername());
    message.set('timestamp', (new Date()).getTime());
    await message.save();
    this.setState({ inputVal: '' });
  }

  closeModal() {
    this.setState({ modal: null });
  }

  render() {
    const {
      messages, inputVal, isLoading, modal,
    } = this.state;
    return (
      <div className="chatPane">
        <div className="messagePane">
          {isLoading && <p>LOADING STUFF</p>}
          <Scrollbars ref={this.scrollbar} style={{ paddingRight: 5 }}>
            <div className="messageWrapper">
              {messages.map(renderChatMessage)}
            </div>
          </Scrollbars>
        </div>

        <Form className="inputBar" onSubmit={this.onSend}>
          <Form.Control type="text" value={inputVal} onChange={(e) => this.setState({ inputVal: e.target.value })} />
          <Button variant="primary" type="submit">
            Send
          </Button>
        </Form>

        <Modal show={modal != null} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{(modal || {}).title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{(modal || {}).body}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Close
            </Button>
            {(modal || {}).buttons}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  me: state.auth.me,
});

export default connect(mapStateToProps)(
  withRouter(ChatPane),
);
