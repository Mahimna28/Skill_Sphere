fetch("http://localhost:3001/api/blog").then(r => r.text()).then(console.log).catch(console.error);
