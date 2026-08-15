const fetch = require('node-fetch');

async function testBackend() {
  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Hello", mode: "belajar" })
    });
    
    if (res.status === 200) {
      console.log("SUCCESS");
    } else {
      console.log("FAILED WITH STATUS:", res.status);
      const text = await res.text();
      console.log("Response:", text);
    }
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}

testBackend();
