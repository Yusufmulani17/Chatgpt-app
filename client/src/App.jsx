import { useState, useEffect } from 'react';
import axios from 'axios';

import send from './assets/send.svg';
import user from './assets/user.png';
import bot from './assets/bot.png';
import loadingIcon from './assets/loader.svg';

// let arr = [
//   { type: 'user', post: 'fafafafgadh' },
//   { type: 'bot', post: 'fafsfgahg' },
// ];

function App() {
  const [input, setInput] = useState('');
  const [posts, setPosts] = useState([]);
  // console.log(posts);
  // console.log(input);

  useEffect(() => {
    document.querySelector('.layout').scrollTop =
      document.querySelector('.layout').scrollHeight;
  }, [posts]);
  // let arr = [
  //   { type: 'user', post: 'fafafafgadh' },
  //   { type: 'bot', post: 'fafsfgahg' },
  // ];

  const fecthBotResponse = async () => {
    const { data } = await axios.post(
      'http://localhost:4000',
      {
        input,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  };

  const onSubmit = () => {
    if (input.trim() === '') return;
    updatePosts(input);
    updatePosts('loading...', false, true);
    setInput('');
    fecthBotResponse().then((res) => {
      console.log(res);
      updatePosts(res.bot.trim(), true);
    });
  };

  const autoTypingBotResponse = (text) => {
    console.log(text.length);
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          console.log(prevState);
          let lastItem = prevState.pop();
          if (lastItem.type !== 'bot') {
            prevState.push({
              type: 'bot',
              post: text.charAt(index - 1),
            });
          } else {
            prevState.push({
              type: 'bot',
              post: lastItem.post + text.charAt(index - 1),
            });
          }
          return [...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      console.log(post);
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        return [...prevState, { type: isLoading ? 'loading' : 'user', post }];
      });
    }
  };

  const onKeyUp = (e) => {
    if (e.key === 'Enter' || e.which === 13) {
      onSubmit();
    }
  };
  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {posts.map((post, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                post.type === 'bot' || post.type === 'loading' ? 'bot' : ''
              }`}
            >
              <div className="avatar">
                <img
                  src={
                    post.type === 'bot' || post.type === 'loading' ? bot : user
                  }
                />
              </div>
              {post.type === 'loading' ? (
                <div className="loader">
                  <img src={loadingIcon} />
                </div>
              ) : (
                <div className="post">{post.post}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer>
        <input
          value={input}
          className="composebar"
          autoFocus
          type="text"
          placeholder="Ask Anything!"
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} />
        </div>
      </footer>
    </main>
  );
}

export default App;
{
  /*<section className="chat-container">
        <div className="layout">
          <div className="chat-bubble">
            <div className="avatar">
              <img src={user} />
            </div>
            <div className="post">Lorem ipsum dolor sit, amet </div>
          </div>
          <div className="chat-bubble bot">
            <div className="avatar">
              <img src={bot} />
            </div>
            <div className="post">Lorem ipsum dolor sit, amet </div>
          </div>
        </div>
      </section>  */
}
