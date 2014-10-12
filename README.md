<h1>Jekyll Teams</h1>
A simple update on the Jekyll new theme adding Bay Area team colors and images.

<h1>Usage</h1>

Just add an image:

<pre><code>    /images/some-image.png</code></pre>

Then edit the javascript file:

<pre><code>    /javascript/team_colors.js</code></pre>

Update the background and line colors:
<pre>
  <code>
    var myteam_styles = '.site-header { background: white;}';
    myteam_styles += ' body { background: white; }';
    myteam_styles += ' a.site-title { color: black !important;}';
    myteam_styles += ' .page-link { color: black !important;}';
  </code>
</pre>

Add an entry in:

<pre>
  <code>
    /teams.md
  </code>
</pre>

Like this:
<pre>
  <code>
    &lt;button class=&quot;icon&quot; onclick=&quot;appendStyle('team-name');&quot;&gt; <br />
    &lt;img src=&quot;/images/team-name.png&quot; /&gt;<br />
    &lt;/button&gt;<br />
  </code>
</pre>

Just name the image file team-name.png replacing team-name with your team and you should get a button.
<h3>Give it a <a href="https://j-steve-martinez.github.io/teams/">try</a></h3>

<h2>Have Fun!</h2>