const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Remove script tags and event handlers
    return input
      .replace(/<script.*?>.*?<\/script>/gi, '') // Remove <script>...</script>
      .replace(/<[^>]+>/g, '') // Remove all HTML tags
      .replace(/(on\w+=["'][^"']+["'])/g, ''); // Remove event handlers (onerror, onload)
  } else if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item)); // Sanitize each element in the array
  }
  return input;
};

export default {
  sanitizeInput,
};
