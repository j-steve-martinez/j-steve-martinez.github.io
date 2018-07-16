---
layout: post
title:  Radio Delay GUI
date:   2014-11-03 14:11:18
categories: notes
---

During the MLB playoffs I had a hard time listening to the national announcers and decided to turn on the radio.  The problem, as you may know, is the tv broadcast has a delay.  So I needed to delay the radio to sync with the tv.  I found an application for windows but the max deley you could set was 30 seconds.  This worked but the tv delay kept growing and at one point was 26 seconds which was starting to push the boundries of the windows application.  After searching the internet I came across [Radio Delay](https://github.com/stevenryoung/RadioDelay) project by [Steven Young](stevenryoung@gmail.com).

This worked but the applicaion was command line only so I decided to write a graphical user interface using Tkinter.  I forked the project and came up with [Radio Delay Gui](https://github.com/j-steve-martinez/RadioDelayGui).

This is the [snapshot][Image] of the image.

It's simple but it works.  In the future I will implement a stop watch to time the delay so you can easily use that as the delay.

[Image]: https://github.com/j-steve-martinez/RadioDelayGui/blob/master/images/radioDelayGui.png
