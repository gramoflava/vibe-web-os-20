/* ============================================
   Event Bus System
   Pub/sub pattern for decoupled communication
   ============================================ */

const Bus = (() => {
  const topics = new Map();

  /**
   * Subscribe to a topic
   * @param {string} topic - Event topic name
   * @param {Function} handler - Callback function
   * @returns {Function} Unsubscribe function
   */
  function on(topic, handler) {
    if (!topics.has(topic)) {
      topics.set(topic, new Set());
    }

    topics.get(topic).add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = topics.get(topic);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          topics.delete(topic);
        }
      }
    };
  }

  /**
   * Subscribe to a topic once (auto-unsubscribe after first call)
   * @param {string} topic - Event topic name
   * @param {Function} handler - Callback function
   * @returns {Function} Unsubscribe function
   */
  function once(topic, handler) {
    const unsubscribe = on(topic, (payload) => {
      handler(payload);
      unsubscribe();
    });
    return unsubscribe;
  }

  /**
   * Emit an event to all subscribers
   * @param {string} topic - Event topic name
   * @param {*} payload - Data to pass to handlers
   */
  function emit(topic, payload) {
    const handlers = topics.get(topic);
    if (!handlers) return;

    handlers.forEach(handler => {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Error in event handler for topic "${topic}":`, error);
      }
    });
  }

  /**
   * Get number of subscribers for a topic
   * @param {string} topic - Event topic name
   * @returns {number} Number of subscribers
   */
  function count(topic) {
    return topics.get(topic)?.size || 0;
  }

  /**
   * Clear all handlers for a topic
   * @param {string} topic - Event topic name
   */
  function clear(topic) {
    if (topic) {
      topics.delete(topic);
    } else {
      topics.clear();
    }
  }

  return {
    on,
    once,
    emit,
    count,
    clear
  };
})();
