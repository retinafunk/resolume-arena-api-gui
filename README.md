arena rest mobile GUI 
------------------

This is a fork of this official example react app for Resolume Arena REST API 

https://gitlab.resolume.com/public-resolume/arena-rest-triggered

I use this project to learn the Resolume Arena API and to build a custom mobile phone web app GUI for Arena for my own uses. 

I modified it to :

- use TalwindCSS as CSS framework for easier and faster Styling

- optimize layout for mobile phone devices portrait , so use it on a such device or on desktop in mobile emulation mode ( dev Tools) 

- show up to 3 layers stacked
 
- allow horizinatal swipe touch scrolling between the layer clips using css snap API 

- add a button to clear the active clip in each layer

To build the app you need to clone the repo , adjust the host ip and port nuber in src/index.js (line 19,20) to the same you put in your Arena Prefewrence Webserver 

Then install modules ( yarn or npm install in terminal)

Then yarn build or npm build t build the app. 

Copy the build/static to the root  Resolume Webserver folder (ussually in document/Resolume Arena/Webserver or see preferences )
and also the build/index.html
to same , but can be in a subfolder (example : /arena-rest-triggered/build)

The you can access your app with an URL similar to the provided examples 

For example 

http://192.168.178.20:7676/arena-rest-triggered/build





more features coming soon!

Feel free to contribute  improve or fork it .

If you do anything with it I'll be happy to hear.
