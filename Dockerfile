FROM node:20

# workspace dir
WORKDIR /usr/src/app

# copy files into container
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the code
COPY . .
RUN npm run build
# set the access port
EXPOSE 3001

# start api
CMD ["npm", "start"]