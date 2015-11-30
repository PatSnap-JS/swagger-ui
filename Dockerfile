FROM local-dtr.patsnap.com/patsnap/node4.1-nginx



ADD container_files/id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
RUN echo -e "Host *\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

ADD container_files /
ADD . /data/swagger-ui
WORKDIR /data/swagger-ui

RUN git config --global user.email "swagger.doc@patsnap.com"
RUN git config --global user.name "doc swagger"

RUN \
    npm set registry=http://192.168.3.115:4873 \
    && npm install swagger gulp -g \
    && npm install \
    && npm run serve



EXPOSE 3000-10000


