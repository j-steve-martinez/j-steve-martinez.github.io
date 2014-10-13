---
layout: post
title:  Locate A Debian File
date:   2014-10-13 14:25:25
categories: notes debian
---
Sometimes you want to know where a file should be located.  You can just search the apt-file system for the location to where a file is installed.

{% highlight bash %}
sudo apt-get install apt-file
{% endhighlight %}

This allows you to search for packages containing a file.

Then, update its database using:

{% highlight bash %}
apt-file update
{% endhighlight %}

Then, look for the file:

{% highlight bash %}
apt-file search perlio.h
{% endhighlight %}

You get a package name and install location:

{% highlight bash %}
libapache2-mod-perl2-dev: /usr/include/apache2/modperl_apr_perlio.h
libimager-perl: /usr/lib/perl5/Imager/include/imperlio.h
perl: /usr/lib/perl/5.18.2/CORE/perlio.h
{% endhighlight %}


