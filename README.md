<h1>📊 strapi-google-analytics-dashboard</h1>

<p>
  A plug-and-play Google Analytics 4 dashboard for Strapi 5.x. No code required — just install, configure your credentials, and instantly start tracking GA metrics directly in your admin panel.
</p>

<p>
  <a href="https://www.npmjs.com/package/strapi-google-analytics-dashboard">
    <img src="https://img.shields.io/npm/v/strapi-google-analytics-dashboard.svg" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/strapi-google-analytics-dashboard">
    <img src="https://img.shields.io/npm/dm/strapi-google-analytics-dashboard.svg" alt="npm downloads" />
  </a>
  <a href="https://github.com/victorolayemi/strapi-google-analytics-dashboard/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/strapi-google-analytics-dashboard.svg" alt="license" />
  </a>
</p>

<img src="./screenshots/charts.png" alt="Google Analytics Dashboard UI" style="border:1px solid #ddd; border-radius: 8px; max-width:100%; margin-top: 1em;" />

<hr />

<h2>🚀 Features</h2>
<ul>
  <li>📈 Overview of key metrics (Active Users, Sessions, Page Views, Bounce Rate, etc)</li>
  <li>🌍 Users by Country & Device</li>
  <li>🔗 Top Pageviews</li>
  <li>🧭 Sessions by Source</li>
  <li>📆 Date range filters (Last 7/30/90/180/365 days)</li>
  <li>🎯 Fully responsive and built with Strapi Design System</li>
</ul>

<hr />

<h2>⚙️ Installation</h2>

<pre><code>npm install strapi-google-analytics-dashboard</code></pre>

or

<pre><code>yarn add strapi-google-analytics-dashboard</code></pre>

Then restart your Strapi server.
<pre><code>npx strapi develop</code></pre>

or

<pre><code>npm run develop</code></pre>

or 

<pre><code>yarn develop</code></pre>

---

<h2>🧩 Usage</h2>

<ol>
  <li>Go to <strong>Settings &gt; Google Analytics</strong> inside your Strapi Admin panel.</li>
  <li>Paste the following:
    <ul>
      <li><strong>GA Property ID</strong> (e.g., <code>342132078</code>)</li>
      <li><strong>GA Measurement ID</strong> (optional)</li>
      <li><strong>GA Service Account JSON</strong> – the service account credentials JSON from Google Cloud.</li>
    </ul>
  </li>
</ol>

📌 <strong>NOTE:</strong> You must have already set up Google Analytics 4 on your frontend app (e.g., with the <code>gtag.js</code> snippet) and collected some traffic.

<img src="./screenshots/settings.png" alt="Google Analytics Dashboard UI" style="border:1px solid #ddd; border-radius: 8px; max-width:100%; margin-top: 1em;" />

<hr />

<h2>🔑 How to Get Google Analytics Credentials</h2>

<ol>
  <li>Go to <a href="https://console.cloud.google.com/">Google Cloud Console</a>.</li>
  <li>Create a new project or select an existing one.</li>
  <li>Enable the <strong>Google Analytics Data API</strong>.</li>
  <li>Go to <strong>APIs & Services &gt; Credentials</strong> and:
    <ul>
      <li>Create a <strong>Service Account</strong>.</li>
      <li>Generate a JSON key for that account (you’ll paste this in the plugin settings).</li>
    </ul>
  </li>
  <li>Go to your GA4 Admin panel and under <strong>Property &gt; Account Settings</strong>, add the service account email as a Viewer.</li>
</ol>


<h2>🙌 Contributions</h2>
<p>
  PRs and suggestions welcome! Please open issues for feature requests or bugs.
</p>

<hr />

<h2>📄 License</h2>
<p>
  MIT License
</p>
