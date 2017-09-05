# socket.io-mutiplayer-client
This is a _BASIC_ sample of how a multiplayer (on the client-side) game could work, implemented with Client Side Prediction and Interpolation, the code is rewritten from Sven Bergströms article: http://buildnewgames.com/real-time-multiplayer/

The reason I rewrote the code was because the code in his example was hard to understand (too messy) and I also wanted to clean it up using ES6 classes.

You can find the server-side code [HERE](https://github.com/emilsivervik/socket.io-mutiplayer-server)

## install 
        npm install

## build 
        npm run build

## webpack with live reload
        npm run start

## serving static files
I used nginx for this project and made it proxy all the requests to node.js

The basic config that I used for nginx looks like this (root should be absolute dir of your dist folder)- 

        events {
            worker_connections  1024;
        }

        http {
            expires off;
            gzip  on;
            include    mime.types;	
            sendfile off;	
            upstream socket_nodes {
                ip_hash;
                server 127.0.0.1:8080;
            }
            server {
                listen       80;
                server_name  localhost;
                
                location / {            
                    root ABSOLUTE/DIR/HERE/dist/;		
                    index  index.html index.htm;
                    add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
                    expires off;
                }
                
                location /socket.io/ {
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection "upgrade";
                    proxy_redirect off;

                    proxy_buffers 8 32k;
                    proxy_buffer_size 64k;

                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_set_header Host $http_host;
                    proxy_set_header X-NginX-Proxy true;
                    proxy_pass http://socket_nodes;
                }
            }
        }
