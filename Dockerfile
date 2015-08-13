FROM node:0.12

RUN npm install -g grunt-cli karma-cli phantomjs bower protractor --unsafe-perm

RUN apt-get update \
  && apt-get install -y ruby-full \
  && gem install sass

WORKDIR /usr/src/app

COPY ["package.json", "npm-shrinkwrap.json", "bower.json", "/usr/src/app/"]
RUN npm install --unsafe-perm \
  && bower install --allow-root

COPY . /usr/src/app
ENV \
  PUBLIC_HOST=web \
  MONGO_URI=mongodb://mongo/FarseerDev \
  PHANTOMJS_BIN=/usr/local/lib/node_modules/phantomjs/lib/phantom/bin/phantomjs

CMD [ "grunt", "serve" ]

EXPOSE 9000
EXPOSE 9001
