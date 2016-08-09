---
layout: post
title:  Roll Back Firefox on Mint
date:   2016-08-08 19:14:27
categories: ubuntu, mint, apt
---
# Note on rolling back a package in Ubuntu flavor Mint

After updating to Firefox to version 48 on Mint I was a bit shocked to find that the search amonge other things was completely broken.
No right click for copy or open a link in a new tab.  So I had to roll Firefox back.

This is just a note on how to roll back a package quickly:

**Get a list of versions:**
{% highlight bash %}
apt-cache policy firefox
  Installed: 48.0+linuxmint1+sarah
  Candidate: 45.0.2+build1-0ubuntu1
{% endhighlight %}

**Run the apt-get command:**
{% highlight bash %}
sudo apt-get install firefox=45.0.2+build1-0ubuntu1
{% endhighlight %}

You may want to uninstall first but didn't.

*Optional:* put a hold on the package so the system won't update in the future.

**Put package on hold:**
{% highlight bash %}
echo "firefox hold" | sudo dpkg --set-selections
{% endhighlight %}
