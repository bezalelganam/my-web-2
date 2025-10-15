
/* Enhanced chat widget with Firebase integration and mobile optimization */
(function(){
  // Check if Firebase is available
  if (typeof firebase === 'undefined') {
    console.warn('Firebase not loaded. Chat widget will not function properly.');
    return;
  }

  let unreadCount = 0;
  let chatUnsubscribe = null;
  let isMobile = window.innerWidth <= 768;

  function createButton(){
    if(document.getElementById('assistant-chat-widget-btn')) return;
    
    const btn = document.createElement('button');
    btn.id = 'assistant-chat-widget-btn';
    btn.setAttribute('aria-label','Open live chat');
    btn.style.position='fixed';
    btn.style.right='16px';
    btn.style.bottom='80px';
    btn.style.zIndex=9999;
    btn.style.border='none';
    btn.style.borderRadius='50%';
    btn.style.width=isMobile ? '60px' : '56px';
    btn.style.height=isMobile ? '60px' : '56px';
    btn.style.boxShadow='0 6px 18px rgba(0,0,0,.3)';
    btn.style.background='linear-gradient(135deg, #ef4444, #dc2626)';
    btn.style.color='white';
    btn.style.fontSize=isMobile ? '24px' : '20px';
    btn.style.cursor='pointer';
    btn.style.transition='all 0.3s ease';
    btn.innerHTML='💬';
    
    // Add hover effect
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 6px 18px rgba(0,0,0,.3)';
    });

    // Add notification badge
    const badge = document.createElement('div');
    badge.id = 'chat-notification-badge';
    badge.style.position = 'absolute';
    badge.style.top = '-5px';
    badge.style.right = '-5px';
    badge.style.background = '#10b981';
    badge.style.color = 'white';
    badge.style.borderRadius = '50%';
    badge.style.width = '20px';
    badge.style.height = '20px';
    badge.style.fontSize = '12px';
    badge.style.display = 'none';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.fontWeight = 'bold';
    btn.appendChild(badge);

    btn.onclick = function(){
      openChat();
    };
    
    document.body.appendChild(btn);
    
    // Setup Firebase listener for unread messages
    setupUnreadListener();
  }

  function openChat() {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert('Please login to use live chat');
      // Try to redirect to login
      if (window.location.hash !== '#login') {
        window.location.hash = 'login';
      }
      return;
    }

    // Open chat in popup or new tab based on device
    const url = 'chatManager.html?from_widget=1';
    const width = isMobile ? '100%' : '420';
    const height = isMobile ? '100%' : '720';
    
    if (isMobile) {
      // On mobile, open in new tab
      window.open(url, '_blank');
    } else {
      // On desktop, open popup
      const w = window.open(url, 'chatwin', `width=${width},height=${height},resizable=yes,scrollbars=yes,location=no,menubar=no,toolbar=no`);
      if (!w) {
        // Fallback if popup blocked
        window.open(url, '_blank');
      }
    }
  }

  function setupUnreadListener() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    // Listen for new messages
    chatUnsubscribe = firebase.firestore()
      .collection('chats')
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const chatData = doc.data();
          const messages = chatData.messages || [];
          
          // Count unread messages (messages from admin that user hasn't seen)
          const lastUserMessageIndex = messages.map((msg, index) => 
            msg.sender === 'user' ? index : -1
          ).filter(index => index !== -1).pop();
          
          const unreadMessages = messages.slice((lastUserMessageIndex || -1) + 1)
            .filter(msg => msg.sender === 'admin');
          
          updateUnreadBadge(unreadMessages.length);
        }
      });
  }

  function updateUnreadBadge(count) {
    const badge = document.getElementById('chat-notification-badge');
    if (!badge) return;

    if (count > 0) {
      badge.textContent = count > 9 ? '9+' : count.toString();
      badge.style.display = 'flex';
      unreadCount = count;
    } else {
      badge.style.display = 'none';
      unreadCount = 0;
    }
  }

  // Handle window resize
  window.addEventListener('resize', function() {
    isMobile = window.innerWidth <= 768;
    const btn = document.getElementById('assistant-chat-widget-btn');
    if (btn) {
      btn.style.width = isMobile ? '60px' : '56px';
      btn.style.height = isMobile ? '60px' : '56px';
      btn.style.fontSize = isMobile ? '24px' : '20px';
    }
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
    if (chatUnsubscribe) {
      chatUnsubscribe();
    }
  });

  // Initialize when DOM is ready
  if(document.readyState==='loading') {
    document.addEventListener('DOMContentLoaded', createButton);
  } else {
    createButton();
  }
})();
