import React, { useEffect } from "react";
import { StyleSheet, Platform, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WebRTCChatScreen() {

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 20px;
      min-height: 100vh;
    }

    .container {
      position: fixed;
      bottom: 20px;
      width: 80%;
      max-width: 500px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 15px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    }

    .containe {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: rgba(0, 0, 0, 0.3);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    }

    h1,
    h2 {
      text-align: center;
    }

    button {
      background: #2563eb;
      border: none;
      color: white;
      padding: 10px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 15px;
      margin-top: 8px;
      width: 100%;
    }

    button:hover {
      background: #1d4ed8;
    }

    textarea {
      width: 100%;
      padding: 8px;
      border-radius: 6px;
      border: none;
      outline: none;
      margin-top: 6px;
      font-size: 14px;
      box-sizing: border-box;
    }

    input {
      width: 100%;
      padding: 0 15px;
      border-radius: 20px;
      border: none;
      outline: none;
      margin-top: 6px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .copy-btn {
      background: #10b981;
      margin-top: 5px;
    }

    .copy-btn:hover {
      background: #059669;
    }

    .hidden {
      display: none;
    }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      color: white;
    }

    .badge.online {
      background: #22c55e;
    }

    #chat {
      flex: 1;
      overflow-y: auto;
      padding: 5px 10px;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      /* padding-bottom: 60px; */
    }

    #chat div {
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-width: 80%;
      padding: 8px;
      border-radius: 12px;
      display: inline-block;
    }

    /* Small gap if same sender */
    #chat .me+.me,
    #chat .other+.other {
      margin-top: 3px;
    }

    /* Big gap if sender changes */
    #chat .me+.other,
    #chat .other+.me {
      margin-top: 10px;
    }

    .me {
      text-align: left;
      color: #4ade80;
      background: rgba(74, 222, 128, 0.2);
      /* light green bubble */
      align-self: flex-end;
      /* right side */
    }

    .other {
      text-align: left;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.2);
      /* light blue bubble */
      align-self: flex-start;
      /* left side */
    }

    .typing {
      margin-top: 3px;
      text-align: left;
      color: #94a3b8;
      font-style: italic;
      background: rgba(56, 189, 248, 0.2);
      align-self: flex-start;
    }

    #sendBtn {
      background: #2563eb;
      border: none;
      color: white;
      padding: 10px 14px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 15px;
      font-weight: bold;
      margin-top: 8px;
      /* width: 100%; */
    }

    .chat-input {
      display: flex;
      gap: 6px;
      padding: 5px 10px;
    }

    .chat-input input {
      flex: 1;
    }

    .chat-input button {
      width: auto;
    }

    .chat-header {
      padding: 10px;
      background: rgba(0, 0, 0, 0.3);
      text-align: center;
    }

    .close-btn {
      position: absolute;
      top: 8px;
      right: 12px;
      background: none;
      border: none;
      font-size: 22px;
      font-weight: bold;
      color: red;
      cursor: pointer;
    }

    .close-btn:hover {
      color: darkred;
    }

    footer {
      text-align: center;
      margin-top: 15px;
      font-size: 12px;
      color: #777;
    }

    @media (max-width: 600px) {
      body {
        padding: 0;
      }
    }
      </style>
    </head>
    <body>
      <div class="container" id="startScreen">
    <p style="text-align: center;">Choose An Option</p>
    <button id="chooseCreate">Create Room</button>
    <button id="chooseJoin">Join Room</button>
    <footer>© 2025 Lobby</footer>
  </div>

  <div class="container hidden" id="createScreen">
    <span class="close-btn" id="closeCreate">&times;</span>
    <h2>Create Room</h2>
    <button id="createOfferBtn">Generate Offer Code</button>
    <textarea id="offerOut" placeholder="Offer code will appear here" readonly></textarea>
    <button class="copy-btn" data-copy="offerOut">Copy Offer Code</button>

    <textarea id="answerIn" placeholder="Paste answer code here"></textarea>
    <button id="connectBtn">Connect</button>
  </div>

  <div class="container hidden" id="joinScreen">
    <span class="close-btn" id="closeJoin">&times;</span>
    <h2>Join Room</h2>
    <textarea id="offerIn" placeholder="Paste offer code here"></textarea>
    <button id="createAnswerBtn">Generate Answer Code</button>
    <textarea id="answerOut" placeholder="Answer code will appear here" readonly></textarea>
    <button class="copy-btn" data-copy="answerOut">Copy Answer Code</button>
  </div>

  <div class="containe hidden" id="chatScreen">
    <div class="chat-header">
      <span id="statusBadge" class="badge">Offline</span>
    </div>
    <div id="chat"></div>
    <div class="chat-input">
      <input id="msg" placeholder="Type message..." />
      <button id="sendBtn">➤</button>
    </div>
  </div>
      <script>
        const startScreen = document.getElementById('startScreen');
    const createScreen = document.getElementById('createScreen');
    const joinScreen = document.getElementById('joinScreen');
    const chatScreen = document.getElementById('chatScreen');
    const statusBadge = document.getElementById('statusBadge');
    const chatDiv = document.getElementById('chat');
    const msgInput = document.getElementById('msg');

    let pc, dc;
    const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

    // Typing indicator
    let typingTimeout;
    let typingElem;
    let typingDotsInterval;

    function autoScroll(force = false) {
      const isAtBottom = chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight < 50;
      if (force || isAtBottom) {
        chatDiv.scrollTo({ top: chatDiv.scrollHeight, behavior: 'smooth' });
      }
    }


    function showTyping() {
      if (!typingElem) {
        typingElem = document.createElement('div');
        typingElem.className = 'typing';
        typingElem.innerHTML = 'typing<span class="dots">.</span>';
        chatDiv.appendChild(typingElem);
      }

      let step = 1;
      clearInterval(typingDotsInterval);
      typingDotsInterval = setInterval(() => {
        const dotsEl = typingElem.querySelector(".dots");
        if (dotsEl) {
          dotsEl.textContent = ".".repeat((step % 3) + 1);
        }
        autoScroll();
        step++;
      }, 300);
    }


    function hideTyping() {
      clearInterval(typingDotsInterval);
      if (typingElem) {
        chatDiv.removeChild(typingElem);
        typingElem = null;
      }
    }

    function showScreen(screen) {
      [startScreen, createScreen, joinScreen, chatScreen].forEach(s => s.classList.add('hidden'));
      screen.classList.remove('hidden');
    }

    function logMsg(msg, type) {
      hideTyping();
      const wasAtBottom = chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight < 50;

      const div = document.createElement('div');
      div.className = type;
      div.textContent = msg;
      chatDiv.appendChild(div);
      if (wasAtBottom) {
        autoScroll(true);
      }
      msgInput.focus({ preventScroll: true });
    }

    // Send message
    document.getElementById('sendBtn').onclick = () => {
      const text = msgInput.value.trim();
      if (dc && dc.readyState === 'open' && text !== "") {
        dc.send(text);
        logMsg(text, 'me');
        msgInput.value = '';
        msgInput.focus({ preventScroll: true });

      }
    };

    // Keep keyboard active while typing
    msgInput.addEventListener('input', () => {
      if (dc && dc.readyState === 'open') {
        dc.send("__typing__");
        msgInput.focus({ preventScroll: true });
      }
    });

    // Optional: refocus input if screen tapped
    /* chatDiv.addEventListener('click', () => {
      msgInput.focus({ preventScroll: true });
    }); */

    function updateStatus(online) {
      statusBadge.textContent = online ? "Online" : "Offline";
      statusBadge.classList.toggle('online', online);
    }

    document.getElementById('chooseCreate').onclick = () => showScreen(createScreen);
    document.getElementById('chooseJoin').onclick = () => showScreen(joinScreen);

    // Close buttons
    document.getElementById('closeCreate').onclick = () => showScreen(startScreen);
    document.getElementById('closeJoin').onclick = () => showScreen(startScreen);

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.onclick = () => {
        const targetId = btn.getAttribute('data-copy');
        const text = document.getElementById(targetId).value;

        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => btn.textContent = "Copy " + (targetId.includes("offer") ? "Offer" : "Answer") + " Code", 1500);
        }).catch(() => {
          const temp = document.createElement("textarea");
          temp.value = text;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);

          btn.textContent = "Copied!";
          setTimeout(() => btn.textContent = "Copy " + (targetId.includes("offer") ? "Offer" : "Answer") + " Code", 1500);
        });
      };
    });

    document.getElementById('createOfferBtn').onclick = async () => {
      pc = new RTCPeerConnection(config);
      dc = pc.createDataChannel('chat');
      dc.onmessage = e => {
        if (e.data === "__typing__") {
          showTyping();
          clearTimeout(typingTimeout);
          typingTimeout = setTimeout(hideTyping, 1500);
        } else {
          logMsg(e.data, 'other');
        }
      };
      dc.onopen = () => {
        updateStatus(true);
        showScreen(chatScreen);
      };
      dc.onclose = () => updateStatus(false);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      pc.onicecandidate = e => {
        if (!e.candidate) document.getElementById('offerOut').value = JSON.stringify(pc.localDescription);
      };
    };

    document.getElementById('createAnswerBtn').onclick = async () => {
      pc = new RTCPeerConnection(config);
      pc.ondatachannel = e => {
        dc = e.channel;
        dc.onmessage = ev => {
          if (ev.data === "__typing__") {
            showTyping();
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(hideTyping, 1500);
          } else {
            logMsg(ev.data, 'other');
          }
        };
        dc.onopen = () => {
          updateStatus(true);
          showScreen(chatScreen);
        };
        dc.onclose = () => updateStatus(false);
      };
      await pc.setRemoteDescription(JSON.parse(document.getElementById('offerIn').value));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      pc.onicecandidate = e => {
        if (!e.candidate) document.getElementById('answerOut').value = JSON.stringify(pc.localDescription);
      };
    };

    document.getElementById('connectBtn').onclick = async () => {
      await pc.setRemoteDescription(JSON.parse(document.getElementById('answerIn').value));
    };

    document.getElementById('sendBtn').onclick = () => {
      if (dc && dc.readyState === 'open' && msgInput.value.trim() !== "") {
        dc.send(msgInput.value);
        logMsg(msgInput.value, 'me');
        msgInput.value = '';
        msgInput.focus({ preventScroll: true });
        setTimeout(() => {
          chatDiv.scrollTo({ top: chatDiv.scrollHeight, behavior: 'smooth' });
        }, 50);
      }
    };

    // Send typing indicator when typing
    msgInput.addEventListener('input', () => {
      if (dc && dc.readyState === 'open') {
        dc.send("__typing__");
        msgInput.focus({ preventScroll: true });
      }
    });
    msgInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // stop newline
        document.getElementById("sendBtn").click(); // trigger send
      }
    });
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"   // light icons & text
        backgroundColor="#0f172a"  // dark blue background under status bar
      />
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        setSupportMultipleWindows={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
});
