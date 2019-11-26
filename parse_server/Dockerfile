FROM node:lts-alpine

RUN mkdir parse

ADD . /parse
WORKDIR /parse
RUN npm install

ENV APP_ID AppId
ENV MASTER_KEY MasterKey
ENV JAVASCRIPT_KEY JavascriptKey
ENV DATABASE_URI mongodb://mongo:27017/dev
ENV SERVER_URL http://localhost:1337/parse

# Optional (default : 'parse/cloud/main.js')
# ENV CLOUD_CODE_MAIN cloudCodePath

# Optional (default : '/parse')
# ENV PARSE_MOUNT mountPath

ENV PORT=1337

# Optional (default : VERBOSE=0)
# ENV VERBOSE=1

EXPOSE $PORT            

CMD [ "npm", "start" ]
