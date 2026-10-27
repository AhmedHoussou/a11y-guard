import * as http from 'http';

const INACCESSIBLE_HTML = `
<!DOCTYPE html>
<html lang=""> <!-- WCAG Violation: Empty html lang attribute -->
<head>
  <title>Inaccessible Test Page</title>
</head>
<body style="background-color: #ffffff; color: #e0e0e0;"> <!-- WCAG Violation: Very low contrast text -->

  <!-- WCAG Violation: Heading hierarchy skipped (h1 missing, starts with h3) -->
  <h3>User Registration Portal</h3>

  <!-- WCAG Violation: Image missing alt attribute -->
  <img src="banner.png">

  <!-- WCAG Violation: Form controls without labels -->
  <div>
    <input type="text" placeholder="Enter your full name">
  </div>

  <div>
    <input type="email" placeholder="Enter email">
  </div>

  <!-- WCAG Violation: Empty button without accessible name or text -->
  <button style="width: 50px; height: 30px;"></button>

</body>
</html>
`;

const ACCESSIBLE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Compliant Accessible Portal</title>
</head>
<body style="background-color: #ffffff; color: #1a1a1a;">
  <main>
    <h1>User Registration Portal</h1>
    <img src="banner.png" alt="Company registration header logo">
    
    <form>
      <div>
        <label for="name">Full Name</label>
        <input id="name" type="text" required>
      </div>

      <div>
        <label for="email">Work Email</label>
        <input id="email" type="email" required>
      </div>

      <button type="submit">Submit Registration</button>
    </form>
  </main>
</body>
</html>
`;

export function startDemoServer(port = 8085): http.Server {
  const server = http.createServer((req, res) => {
    if (req.url === '/accessible') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(ACCESSIBLE_HTML);
      return;
    }

    // Default serves the failing inaccessible demo page
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(INACCESSIBLE_HTML);
  });

  server.listen(port);
  return server;
}