speler
======

Improved from my mypad version

Example
=======

<img src="web/img/example.png">

Installation
============

Git the codes:
<pre>git clone <this repo></pre>

As this is Symfony, you need to install the Symfony framework:
<pre>$ php composer.phar update</pre>

As this uses bower for the front-end, you can install/update the libraries via bower. It is however committed to the repo as
 is the recommended practice, therefore nothing is necessary to set it up.

Set up MySQL:
<pre>php app/console doctrine:schema:update --force</pre>

You will need to set up your music folder. This is located at:
<pre>/web/audio</pre>
Copy your music files to that folder.

Support
=======
mp3 and m4a. If other, please inform me.

Advanced
=======

To achieve a 'cloud' effect, I use dropbox for my music folder. And then I make a symlink
 from `web/audio` to my music folder in Dropbox.
Also, the db is then hosted at an ISP, and I've set up my db details accordingly. Note:
I'm using a shared hosting, so the lag is horrible.
