FROM local-dtr.patsnap.com/patsnap/node4.2

RUN echo -e "Host *\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

ADD . /data/swagger-ui
WORKDIR /data/swagger-ui

RUN \
    npm set registry=http://192.168.3.115:4873 \
    && npm install swagger gulp -g \
    && npm install \
    && npm run serve

EXPOSE 3000-10000


