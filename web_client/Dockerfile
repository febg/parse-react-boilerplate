FROM node:lts-alpine

RUN mkdir web_client

ADD . /web_client
WORKDIR /web_client
RUN npm install


# Optional (default : 'parse/cloud/main.js')
# ENV CLOUD_CODE_MAIN cloudCodePath

# Optional (default : '/parse')
# ENV PARSE_MOUNT mountPath

ENV PORT=3000
EXPOSE $PORT            

CMD [ "npm", "start" ]
