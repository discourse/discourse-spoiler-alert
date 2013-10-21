discourse-spoiler-alert
=======================

Spoiler plugin for [Discourse](http://discourse.org) highly inspired by the [spoiler-alert](http://joshbuddy.github.io/spoiler-alert/) jQuery plugin.

Usage
=====

In your posts, surround text or images with `[spoiler]` ... `[/spoiler]`. 
For example: 

```
   I watched the murder mystery on TV last night. [spoiler]The butler did it[/spoiler].
```

Installation
============

* Check out the project from github
* Copy the `discourse-spoiler-alert` folder to your `plugins` directory inside Discourse.
* In development mode, run `rake assets:clean`
* In production, recompile your assets: `rake assets:precompile`

License
=======
MIT
